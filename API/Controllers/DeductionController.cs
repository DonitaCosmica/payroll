using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class DeductionController(IDeductionRepository deductionRepository) : Controller
  {
    private readonly IDeductionRepository deductionRepository = deductionRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<DeductionDTO>))]
    public IActionResult GetDedudctions()
    {
      var deductions = deductionRepository.GetDeductions()
        .Select(d => new DeductionDTO
        {
          DeductionId = d.DeductionId,
          Key = d.Key,
          Description = d.Description,
          IsHidden = d.IsHidden
        }).ToList();

      var result = new
      {
        Columns = deductionRepository.GetColumns(),
        Deductions = deductions
      };

      return Ok(result);
    }

    [HttpGet("{deductionId}")]
    [ProducesResponseType(200, Type = typeof(DeductionDTO))]
    [ProducesResponseType(400)]
    public  IActionResult GetDeduction(string deductionId)
    {
      if(!deductionRepository.DeductionExists(deductionId))
        return NotFound();

      var deduction = deductionRepository.GetDeduction(deductionId);
      var deductionDTO = new DeductionDTO
      {
        DeductionId = deduction.DeductionId,
        Key = deduction.Key,
        Description = deduction.Description,
        IsHidden = deduction.IsHidden
      };

      var result = new
      {
        Columns = deductionRepository.GetColumns(),
        Deduction = deductionDTO
      };

      return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateDeduction([FromBody] DeductionDTO deductionCreate)
    {
      if(deductionCreate == null || deductionCreate.Key < 0 || string.IsNullOrEmpty(deductionCreate.Description))
        return BadRequest();
   
      if(deductionRepository.GetDeductionByName(deductionCreate.Description.Trim()) != null)
        return Conflict("Deduction already exists");

      var deduction = new Deduction
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

    [HttpPatch("{deductionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateDeduction(string deductionId, [FromBody] DeductionDTO deductionUpdate)
    {
      if(deductionId == null || deductionUpdate.Key < 0 || string.IsNullOrEmpty(deductionUpdate.Description))
        return BadRequest();

      if(!deductionRepository.DeductionExists(deductionId))
        return NotFound();

      var deduction = deductionRepository.GetDeduction(deductionId);
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

      var deductionToDelete = deductionRepository.GetDeduction(deductionId);
      if(!deductionRepository.DeleteDeduction(deductionToDelete))
        return StatusCode(500, "Something went wrong deleting deduction");

      return NoContent();
    }
  }
}