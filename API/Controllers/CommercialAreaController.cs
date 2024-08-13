using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CommercialAreaController(ICommercialAreaRepository commercialAreaRepository) : Controller
  {
    private readonly ICommercialAreaRepository commercialAreaRepository = commercialAreaRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<CommercialAreaDTO>))]
    public IActionResult GetCommercialAreas()
    {
      var commercialAreas = commercialAreaRepository.GetCommercialAreas()
        .Select(ca => new CommercialAreaDTO
        {
          CommercialAreaId = ca.CommercialAreaId,
          Name = ca.Name
        }).ToList();

      var columns = commercialAreaRepository.GetColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = commercialAreas,
        FormData = commercialAreas
      };

      return Ok(result);
    }

    [HttpGet("{commercialAreaId}")]
    [ProducesResponseType(200, Type = typeof(CommercialAreaDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetCommercialArea(string commercialAreaId)
    {
      if(!commercialAreaRepository.CommercialAreaExists(commercialAreaId))
        return NotFound();

      var commercialArea = commercialAreaRepository.GetCommercialArea(commercialAreaId);
      var commercialAreaDTO = new CommercialAreaDTO
      {
        CommercialAreaId = commercialArea.CommercialAreaId,
        Name = commercialArea.Name
      };

      return Ok(commercialAreaDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateCommercialArea([FromBody] CommercialAreaDTO commercialAreaCreate)
    {
      if(commercialAreaCreate == null || string.IsNullOrEmpty(commercialAreaCreate.Name))
        return BadRequest();

      if(commercialAreaRepository.GetCommercialAreaByName(commercialAreaCreate.Name.Trim()) != null)
        return Conflict("Commercial Area already exists");

      var commercialArea = new CommercialArea
      {
        CommercialAreaId = Guid.NewGuid().ToString(),
        Name = commercialAreaCreate.Name
      };

      if(!commercialAreaRepository.CreateCommercialArea(commercialArea))
        return StatusCode(500, "Something went wrong while saving");
      
      return NoContent();
    }

    [HttpPatch("{commercialAreaId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateCommercialArea(string commercialAreaId, [FromBody] CommercialArea commercialAreaUpdate)
    {
      if(commercialAreaUpdate == null || string.IsNullOrEmpty(commercialAreaUpdate.Name))
        return BadRequest();
      
      if(!commercialAreaRepository.CommercialAreaExists(commercialAreaId))
        return NotFound();

      var commercialArea = commercialAreaRepository.GetCommercialArea(commercialAreaId);
      commercialArea.Name = commercialAreaUpdate.Name;

      if(!commercialAreaRepository.UpdateCommercialArea(commercialArea))
        return StatusCode(500, "Something went wrong updating commercial area");

      return NoContent();
    }

    [HttpDelete("{commercialAreaId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteCommercialArea(string commercialAreaId)
    {
      if(!commercialAreaRepository.CommercialAreaExists(commercialAreaId))
        return NotFound();

      var commercialAreaToDelete = commercialAreaRepository.GetCommercialArea(commercialAreaId);
      if(!commercialAreaRepository.DeleteCommercialArea(commercialAreaToDelete))
        return StatusCode(500, "Something went wrong deleting commercial area");

      return NoContent();
    }
  }
}