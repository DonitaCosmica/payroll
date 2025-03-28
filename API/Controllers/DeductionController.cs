using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;
using API.Enums;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class DeductionController(IDeductionRepository deductionRepository) : Controller
  {
    private readonly IDeductionRepository deductionRepository = deductionRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<DeductionDTO>))]
    public IActionResult GetDeductions()
    {
      List<DeductionDTO> deductions = [.. deductionRepository.GetDeductions()
        .Select(d => new DeductionDTO
        {
          DeductionId = d.DeductionId,
          Key = d.Key,
          Description = d.Description,
          IsHidden = d.IsHidden
        })];

      var deductionsWithCompensation  = deductions.Select(d => new
      {
        d.DeductionId,
        d.Key,
        d.Description,
        d.IsHidden,
        CompensationType = DetermineCompensationType(d.Description).ToString()
      }).ToList();

      List<string> columns = deductionRepository.GetColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = deductions,
        FormData = deductionsWithCompensation 
      };

      return Ok(result);
    }

    [HttpGet("by")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<DeductionDTO>))]
    public IActionResult GetAddDeductions()
    {
      var deductions = deductionRepository.GetDeductions()
        .Select(d => new
        {
          d.DeductionId,
          Name = d.Description,
          Value = 0,
          CompensationType = DetermineCompensationType(d.Description).ToString()
        }).ToList();

      return Ok(deductions);
    }

    [HttpGet("{deductionId}")]
    [ProducesResponseType(200, Type = typeof(DeductionDTO))]
    [ProducesResponseType(400)]
    public  IActionResult GetDeduction(string deductionId)
    {
      if(!deductionRepository.DeductionExists(deductionId))
        return NotFound();

      Deduction deduction = deductionRepository.GetDeduction(deductionId);
      DeductionDTO deductionDTO = new()
      {
        DeductionId = deduction.DeductionId,
        Key = deduction.Key,
        Description = deduction.Description,
        IsHidden = deduction.IsHidden
      };

      return Ok(deductionDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateDeduction([FromBody] DeductionDTO deductionCreate)
    {
      if(deductionCreate == null || string.IsNullOrEmpty(deductionCreate.Key) || string.IsNullOrEmpty(deductionCreate.Description))
        return BadRequest();
   
      if(deductionRepository.GetDeductionByName(deductionCreate.Description.Trim()) != null)
        return Conflict("Deduction already exists");

      Deduction deduction = new()
      {
        DeductionId = Guid.NewGuid().ToString(),
        Key = deductionCreate.Key,
        Description = deductionCreate.Description,
        IsHidden = deductionCreate.IsHidden
      };

      if(!deductionRepository.CreateDeduction(deduction))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPost("csv")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult UpdateDeductions([FromBody] IEnumerable<DeductionDTO> deductions)
    {
      if(deductions == null || !deductions.Any())
        return BadRequest(new { success = false, message = "No deductions provided." });

      foreach(DeductionDTO deduction in deductions)
      {
        if(deduction == null || string.IsNullOrEmpty(deduction.Key) || string.IsNullOrEmpty(deduction.Description))
          return BadRequest(new { success = false, message = "Invalid data for one or more deductions." });

        Deduction? existingDeduction = deductionRepository.GetDeductionByName(deduction.Description.Trim());
        if(existingDeduction == null)
        {
          Deduction newDeduction = new()
          {
            DeductionId = Guid.NewGuid().ToString(),
            Key = deduction.Key,
            Description = deduction.Description,
            IsHidden = deduction.IsHidden
          };

          if(!deductionRepository.CreateDeduction(newDeduction))
            return StatusCode(500, "Something went wrong while saving");
        }
        else
        {
          existingDeduction.Description = deduction.Description;
          existingDeduction.Key = deduction.Key;
          existingDeduction.IsHidden = deduction.IsHidden;

          if(!deductionRepository.UpdateDeduction(existingDeduction))
            return StatusCode(500, "Something went wrong updating deduction"); 
        }
      }

      return Ok(new { success = true, message = "Deductions processed successfully." });
    }

    [HttpPatch("{deductionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateDeduction(string deductionId, [FromBody] DeductionDTO deductionUpdate)
    {
      if(deductionId == null || string.IsNullOrEmpty(deductionUpdate.Key) || string.IsNullOrEmpty(deductionUpdate.Description))
        return BadRequest();

      if(!deductionRepository.DeductionExists(deductionId))
        return NotFound();

      Deduction deduction = deductionRepository.GetDeduction(deductionId);
      deduction.Description = deductionUpdate.Description;
      deduction.Key = deductionUpdate.Key;
      deduction.IsHidden = deductionUpdate.IsHidden;

      if(!deductionRepository.UpdateDeduction(deduction))
        return StatusCode(500, "Something went wrong updating deduction"); 

      return NoContent();
    }

    [HttpDelete("{deductionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteDeduction(string deductionId)
    {
      if(!deductionRepository.DeductionExists(deductionId))
        return NotFound();

      Deduction deductionToDelete = deductionRepository.GetDeduction(deductionId);
      if(!deductionRepository.DeleteDeduction(deductionToDelete))
        return StatusCode(500, "Something went wrong deleting deduction");

      return NoContent();
    }
    private static CompensationType DetermineCompensationType(string description)
    {
      if(description.Contains("Horas") || description.Contains("Extra"))
        return CompensationType.Hours;
      else if(description.Contains("Faltas"))
        return CompensationType.Days;
      else if(description.Contains("Desc"))
        return CompensationType.Discount;

      return CompensationType.Normal;
    }
  }
}