using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;
using API.Enums;

namespace API.Controllers
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
          Name = s.Name,
          StatusType = s.StatusType.ToString()
        }).ToList();

      return Ok(statuses);
    }

    [HttpGet("byType")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<StatusDTO>))]
    public IActionResult GetStatusesByType([FromQuery] string type)
    {
      if(string.IsNullOrEmpty(type) || !TryConvertToStatusType(type, out StatusType statusType))
        statusType = StatusType.Error;

      var statuses = statusRepository.GetStatusesByType(statusType)
        .Select(s => new StatusDTO
        {
          StatusId = s.StatusId,
          Name = s.Name,
          StatusType = s.StatusType.ToString()
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

      if(string.IsNullOrEmpty(statusCreate.StatusType) || !TryConvertToStatusType(statusCreate.StatusType, out StatusType statusType))
        statusType = StatusType.Error;

      var status = new Status
      {
        StatusId = Guid.NewGuid().ToString(),
        Name = statusCreate.Name,
        StatusType = statusType
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

      if(string.IsNullOrEmpty(statusUpdate.StatusType) || !TryConvertToStatusType(statusUpdate.StatusType, out StatusType statusType))
        statusType = StatusType.Error;

      var status = statusRepository.GetStatus(statusId);
      status.Name = statusUpdate.Name;
      status.StatusType = statusType;
      
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

    private static bool TryConvertToStatusType<TEnum>(string value, out TEnum enumValue) where TEnum : struct, Enum =>
      Enum.TryParse(value, ignoreCase: true, out enumValue);
  }
}