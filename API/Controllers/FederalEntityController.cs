using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FederalEntityController(IFederalEntityRepository federalEntityRepository) : Controller
  {
    private readonly IFederalEntityRepository federalEntityRepository = federalEntityRepository;
  
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<FederalEntityDTO>))]
    public IActionResult GetFederalsEntities()
    {
      var federalEntities = federalEntityRepository.GetFederalsEntities()
        .Select(fe => new FederalEntityDTO
        {
          FederalEntityId = fe.FederalEntityId,
          Name = fe.Name
        });

      return Ok(federalEntities);
    }

    [HttpGet("{federalEntityId}")]
    [ProducesResponseType(200, Type = typeof(FederalEntityDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetFederalEntity(string federalEntityId)
    {
      if(!federalEntityRepository.FederalEntityExists(federalEntityId))
        return NotFound();

      var federalEntity = federalEntityRepository.GetFederalEntity(federalEntityId);
      var federalEntityDTO = new FederalEntityDTO
      {
        FederalEntityId = federalEntity.FederalEntityId,
        Name = federalEntity.Name
      };

      return Ok(federalEntityDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateFederalEntity([FromBody] FederalEntityDTO federalEntityCreate)
    {
      if(federalEntityCreate == null)
        return BadRequest();

      var existingFederalEntity = federalEntityRepository.GetFederalsEntities()
        .FirstOrDefault(fe => fe.Name.Trim().Equals(federalEntityCreate.Name.Trim(), StringComparison.CurrentCultureIgnoreCase));

      if(existingFederalEntity != null)
        return Conflict("Federal Entity already exists");

      var federalEntity = new FederalEntity
      {
        FederalEntityId = Guid.NewGuid().ToString(),
        Name = federalEntityCreate.Name
      };

      if(!federalEntityRepository.CreateFederalEntity(federalEntity))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{federalEntityId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateFederalEntity(string federalEntityId, [FromBody] FederalEntityDTO updateFederalEntity)
    {
      if(updateFederalEntity == null)
        return BadRequest();

      if(!federalEntityRepository.FederalEntityExists(federalEntityId))
        return NotFound();

      var federalEntity = federalEntityRepository.GetFederalEntity(federalEntityId);

      if(updateFederalEntity.Name != null)
        federalEntity.Name = updateFederalEntity.Name;

      if(!federalEntityRepository.UpdateFederalEntity(federalEntity))
        return StatusCode(500, "Something went wrong updating Federal Entity");

      return NoContent();
    }

    [HttpDelete("{federalEntityId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteFederalEntity(string federalEntityId)
    {
      if(!federalEntityRepository.FederalEntityExists(federalEntityId))
        return NotFound();

      var federalEntityToDelete = federalEntityRepository.GetFederalEntity(federalEntityId);
      
      if(!federalEntityRepository.DeleteFederalEntity(federalEntityToDelete))
        return StatusCode(500, "Something went wrong deleting Federal Entity");

      return NoContent();
    }
  }
}