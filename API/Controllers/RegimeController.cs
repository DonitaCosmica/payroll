using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class RegimeController(IRegimeRepository regimeRepository) : Controller
  {
    private readonly IRegimeRepository regimeRepository = regimeRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<RegimeDTO>))]
    public IActionResult GetRegimes()
    {
      var regimes = regimeRepository.GetRegimes()
        .Select(r => new RegimeDTO
        {
          RegimeId = r.RegimeId,
          Name = r.Name
        });

      return Ok(regimes);
    }

    [HttpGet("{regimeId}")]
    [ProducesResponseType(200, Type = typeof(RegimeDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetRegime(string regimeId)
    {
      if(!regimeRepository.RegimeExists(regimeId))
        return NotFound();

      var regime = regimeRepository.GetRegime(regimeId);
      var regimeDTO = new RegimeDTO
      {
        RegimeId = regime.RegimeId,
        Name = regime.Name
      };

      return Ok(regimeDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateRegime([FromBody] RegimeDTO regimeCreate)
    {
      if(regimeCreate == null)
        return BadRequest();

      var existingRegime = regimeRepository.GetRegimes()
        .FirstOrDefault(r => r.Name.Trim().Equals(regimeCreate.Name.Trim(), StringComparison.CurrentCultureIgnoreCase));

      if(existingRegime != null)
        return Conflict("Regime already exists");

      var regime = new Regime
      {
        RegimeId = Guid.NewGuid().ToString(),
        Name = regimeCreate.Name
      };

      if(!regimeRepository.CreateRegime(regime))
        return StatusCode(500, "Something went wrong while saving");
      
      return NoContent();
    }

    [HttpPatch("{regimeId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateRegime(string regimeId, [FromBody] RegimeDTO updateRegime)
    {
      if(updateRegime == null)
        return BadRequest();

      if(!regimeRepository.RegimeExists(regimeId))
        return NotFound();

      var regime = regimeRepository.GetRegime(regimeId);

      if(updateRegime.Name != null)
        regime.Name = updateRegime.Name;

      if(!regimeRepository.UpdateRegime(regime))
        return StatusCode(500, "Something went wrong updating regime");

      return NoContent();
    }

    [HttpDelete("{regimeId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteRegime(string regimeId)
    {
      if(!regimeRepository.RegimeExists(regimeId))
        return NotFound();

      var regimeToDelete = regimeRepository.GetRegime(regimeId);

      if(!regimeRepository.DeleteRegime(regimeToDelete))
        return StatusCode(500, "Something went wrong deleting regime");

      return NoContent();
    }
  }
}