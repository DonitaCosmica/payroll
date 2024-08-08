using System.Globalization;
using API.DTO;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PeriodController(IPeriodRepository periodRepository) : Controller
  {
    private readonly IPeriodRepository periodRepository = periodRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<PeriodDTO>))]
    public IActionResult GetPeriods()
    {
      var periods = periodRepository.GetPeriods().Select(MapToPeriodDTORequest);
      var result = new
      {
        Periods = periods,
        Years = periodRepository.GetYears()
      };

      return Ok(result);
    }

    [HttpGet("{periodId}")]
    [ProducesResponseType(200, Type = typeof(PeriodDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetPeriod(string periodId)
    {
      if(!periodRepository.PeriodExists(periodId))
        return NotFound();

      var period = MapToPeriodDTORequest(periodRepository.GetPeriod(periodId));
      return Ok(period);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreatePeriod([FromBody] PeriodDTO createPeriod)
    {
      if(createPeriod == null || createPeriod.PeriodNumber < 0)
        return BadRequest();
      
      if(periodRepository.GetPeriodByWeekYear(createPeriod.PeriodNumber, createPeriod.Year) != null)
        return Conflict("Period already exist");

      var period = new Period
      {
        PeriodId = Guid.NewGuid().ToString(),
        PeriodNumber = createPeriod.PeriodNumber,
        Year = createPeriod.Year
      };

      if(!periodRepository.CreatePeriod(period))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{periodId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdatePeriod(string periodId, [FromBody] PeriodDTO updatePeriod)
    {
      if(updatePeriod == null || updatePeriod.PeriodNumber < 0 || updatePeriod.Year < 2024)
        return BadRequest();

      var period = periodRepository.GetPeriod(periodId);
      if (period == null)
        return NotFound("Period Not Found");

      period.PeriodNumber = updatePeriod.PeriodNumber;
      period.Year = updatePeriod.Year;

      if(!periodRepository.UpdatePeriod(period))
        return StatusCode(500, "Something went wrong updating period");
      
      return NoContent();
    }

    [HttpDelete("{periodId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeletePeriod(string periodId)
    {
      if(!periodRepository.PeriodExists(periodId))
        return NotFound();

      if(!periodRepository.DeletePeriod(periodRepository.GetPeriod(periodId)))
        return StatusCode(500, "Something went wrong deleting Period");

      return NoContent();
    }

    private PeriodDTO MapToPeriodDTORequest(Period period)
    {
      if(period == null) return new PeriodDTO();

      return new PeriodDTO
      {
        PeriodId = period.PeriodId,
        PeriodNumber = period.PeriodNumber,
        Year = period.Year,
      };
    }
  }
}