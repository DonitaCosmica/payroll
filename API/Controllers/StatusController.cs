using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StatusController(IStatusRepository statusRepository) : Controller
  {
    private readonly IStatusRepository statusRepository = statusRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<StatusDTO>))]
    public IActionResult GetStatuses()
    {
      var statuses = statusRepository.GetStatuses()
        .Select(s => new StatusDTO
        {
          StatusId = s.StatusId,
          Name = s.Name
        }).ToList();

      return Ok(statuses);
    }

    [HttpGet("{statusId}")]
    [ProducesResponseType(200, Type = typeof(StatusDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetStatus(string statusId)
    {
      if(!statusRepository.StatusExists(statusId))
        return NotFound();

      var status = statusRepository.GetStatus(statusId);
      var statusDTO = new StatusDTO
      {
        StatusId = status.StatusId,
        Name = status.Name
      };

      return Ok(statusDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateStatus([FromBody] StatusDTO statusCreate)
    {
      if(statusCreate == null || string.IsNullOrEmpty(statusCreate.Name))
        return BadRequest();

      if(statusRepository.GetStatusByName(statusCreate.Name.Trim()) != null)
        return Conflict("Status already exists");

      var status = new Status
      {
        StatusId = Guid.NewGuid().ToString(),
        Name = statusCreate.Name
      };

      if(!statusRepository.CreateStatus(status))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{statusId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateStatus(string statusId, [FromBody] StatusDTO statusUpdate)
    {
      if(statusUpdate == null || string.IsNullOrEmpty(statusUpdate.Name))
        return BadRequest();

      if(!statusRepository.StatusExists(statusId))
        return NotFound();

      var status = statusRepository.GetStatus(statusId);
      status.Name = statusUpdate.Name;

      if(!statusRepository.UpdateStatus(status))
        return StatusCode(500, "Something went wrong updating status");

      return NoContent();
    }

    [HttpDelete("{statusId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteStatus(string statusId)
    {
      if(!statusRepository.StatusExists(statusId))
        return NotFound();

      var statusToDelete = statusRepository.GetStatus(statusId);
      if(!statusRepository.DeleteStatus(statusToDelete))
        return StatusCode(500, "Something went wrong deleting status");

      return NoContent();
    }
  }
}