using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PerceptionController(IPerceptionRepository perceptionRepository) : Controller
  {
    private readonly IPerceptionRepository perceptionRepository = perceptionRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<PerceptionDTO>))]
    public IActionResult GetPerceptions()
    {
      var perceptions = perceptionRepository.GetPerceptions()
        .Select(p => new PerceptionDTO
        {
          PerceptionId = p.PerceptionId,
          Key = p.Key,
          Description = p.Description,
          IsHidden = p.IsHidden
        }).ToList();

      var result = new
      {
        Columns = perceptionRepository.GetColumns(),
        Perceptions = perceptions
      };

      return Ok(result);
    }

    [HttpGet("{perceptionId}")]
    [ProducesResponseType(200, Type = typeof(PerceptionDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetPerception(string perceptionId)
    {
      if(!perceptionRepository.PerceptionExists(perceptionId))
        return NotFound();

      var perception = perceptionRepository.GetPerception(perceptionId);
      var perceptionDTO = new PerceptionDTO
      {
        PerceptionId = perception.PerceptionId,
        Key = perception.Key,
        Description = perception.Description,
        IsHidden = perception.IsHidden
      };

      var result = new
      {
        Columns = perceptionRepository.GetColumns(),
        Perception = perceptionDTO
      };

      return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreatePerception([FromBody] PerceptionDTO perceptionCreate)
    {
      if(perceptionCreate == null)
        return BadRequest();

      if(perceptionRepository.GetPerceptionByName(perceptionCreate.Description.Trim()) != null)
        return Conflict("Perception already exists");

      var perception = new Perception
      {
        PerceptionId = Guid.NewGuid().ToString(),
        Key = perceptionCreate.Key,
        Description = perceptionCreate.Description,
        IsHidden = false
      };

      if(!perceptionRepository.CreatePerception(perception))
        return StatusCode(500, "Something went wrong while saving");
      
      return NoContent();
    }

    [HttpPatch("{perceptionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdatePerception(string perceptionId, [FromBody] PerceptionDTO perceptionUpdate)
    {
      if(perceptionUpdate == null || perceptionUpdate.Key < 0 || string.IsNullOrEmpty(perceptionUpdate.Description))
        return BadRequest();

      if(!perceptionRepository.PerceptionExists(perceptionId))
        return NotFound();

      var perception = perceptionRepository.GetPerception(perceptionId);
      perception.Description = perceptionUpdate.Description;
      perception.Key = perceptionUpdate.Key;
      perception.IsHidden = perceptionUpdate.IsHidden;

      if(!perceptionRepository.UpdatePerception(perception))
        return StatusCode(500, "Something went wrong updating perception");

      return NoContent();
    }

    [HttpDelete("{perceptionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeletePerception(string perceptionId)
    {
      if(!perceptionRepository.PerceptionExists(perceptionId))
        return NotFound();

      var perceptionToDelete = perceptionRepository.GetPerception(perceptionId);
      if(!perceptionRepository.DeletePerception(perceptionToDelete))
        return StatusCode(500, "Something went wrong deleting perception");

      return NoContent();
    }
  }
}