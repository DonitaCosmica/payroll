using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;
using API.Enums;

namespace API.Controllers
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
      List<PerceptionDTO> perceptions = [.. perceptionRepository.GetPerceptions()
        .Select(p => new PerceptionDTO
        {
          PerceptionId = p.PerceptionId,
          Key = p.Key,
          Description = p.Description,
          IsHidden = p.IsHidden
        })];

      var perceptionsWithCompensation = perceptions.Select(p => new
      {
        p.PerceptionId,
        p.Key,
        p.Description,
        p.IsHidden,
        CompensationType = DetermineCompensationType(p.Description).ToString()
      });

      List<string> columns = perceptionRepository.GetColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = perceptions,
        FormData = perceptionsWithCompensation
      };

      return Ok(result);
    }

    [HttpGet("by")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<PerceptionDTO>))]
    public IActionResult GetAddPerceptions([FromQuery] string employeeId)
    {
      var perceptions = perceptionRepository.GetPerceptions()
        .Select(p => new
        {
          p.PerceptionId,
          Name = p.Description,
          Value = p.Description == "Sueldo" ? perceptionRepository.GetBaseSalaryEmployee(employeeId) : 0,
          CompensationType = DetermineCompensationType(p.Description).ToString()
        }).ToList();

      return Ok(perceptions);
    }

    [HttpGet("{perceptionId}")]
    [ProducesResponseType(200, Type = typeof(PerceptionDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetPerception(string perceptionId)
    {
      if(!perceptionRepository.PerceptionExists(perceptionId))
        return NotFound();

      Perception perception = perceptionRepository.GetPerception(perceptionId);
      PerceptionDTO perceptionDTO = new()
      {
        PerceptionId = perception.PerceptionId,
        Key = perception.Key,
        Description = perception.Description,
        IsHidden = perception.IsHidden
      };

      return Ok(perceptionDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreatePerception([FromBody] PerceptionDTO perceptionCreate)
    {
      if(perceptionCreate == null || string.IsNullOrEmpty(perceptionCreate.Key) || string.IsNullOrEmpty(perceptionCreate.Description))
        return BadRequest();

      if(perceptionRepository.GetPerceptionByName(perceptionCreate.Description.Trim()) != null)
        return Conflict("Perception already exists");

      Perception perception = new()
      {
        PerceptionId = Guid.NewGuid().ToString(),
        Key = perceptionCreate.Key,
        Description = perceptionCreate.Description,
        IsHidden = perceptionCreate.IsHidden
      };

      if(!perceptionRepository.CreatePerception(perception))
        return StatusCode(500, "Something went wrong while saving");
      
      return NoContent();
    }

    [HttpPost("csv")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult UpdatePerceptions([FromBody] IEnumerable<PerceptionDTO> perceptions)
    {
      if(perceptions == null || !perceptions.Any())
        return BadRequest(new { success = false, message = "No perceptions provided." });

      foreach(PerceptionDTO perception in perceptions)
      {
        if(perception == null || string.IsNullOrEmpty(perception.Key) || string.IsNullOrEmpty(perception.Description))
          return BadRequest();

        Perception? existingPerception = perceptionRepository.GetPerceptionByName(perception.Description.Trim());
        if(existingPerception == null)
        {
          Perception newPerception = new()
          {
            PerceptionId = Guid.NewGuid().ToString(),
            Key = perception.Key,
            Description = perception.Description,
            IsHidden = perception.IsHidden
          };

          if(!perceptionRepository.CreatePerception(newPerception))
            return StatusCode(500, "Something went wrong while saving");
        }
        else
        {
          existingPerception.Description = perception.Description;
          existingPerception.Key = perception.Key;
          existingPerception.IsHidden = perception.IsHidden;

          if(!perceptionRepository.UpdatePerception(existingPerception))
            return StatusCode(500, "Something went wrong updating perception");
        }
      }

      return Ok(new { success = true, message = "Perceptions processed successfully." });
    }

    [HttpPatch("{perceptionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdatePerception(string perceptionId, [FromBody] PerceptionDTO perceptionUpdate)
    {
      if(perceptionUpdate == null || string.IsNullOrEmpty(perceptionUpdate.Key) || string.IsNullOrEmpty(perceptionUpdate.Description))
        return BadRequest();

      if(!perceptionRepository.PerceptionExists(perceptionId))
        return NotFound();

      Perception perception = perceptionRepository.GetPerception(perceptionId);
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

      Perception perceptionToDelete = perceptionRepository.GetPerception(perceptionId);
      if(!perceptionRepository.DeletePerception(perceptionToDelete))
        return StatusCode(500, "Something went wrong deleting perception");

      return NoContent();
    }

    private static CompensationType DetermineCompensationType(string description)
    {
      if(description.Contains("Salario") || description.Contains("Sueldo"))
        return CompensationType.Principal;
      else if(description.Contains("Horas") || description.Contains("Extra"))
        return CompensationType.Hours;

      return CompensationType.Normal;
    }
  }
}