using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StateController(IStateReporitory stateReporitory) : Controller
  {
    private readonly IStateReporitory stateRepository = stateReporitory;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<StateDTO>))]
    public IActionResult GetStates()
    {
      var states = stateRepository.GetStates()
        .Select(s => new StateDTO 
        {
          StateId = s.StateId,
          Name = s.Name,
          Abbreviation = s.Abbreviation
        }).ToList();

      return Ok(states);
    }

    [HttpGet("{stateId}")]
    [ProducesResponseType(200, Type = typeof(StateDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetState(string stateId)
    {
      if(!stateRepository.StateExists(stateId))
        return NotFound();

      var state = stateRepository.GetState(stateId);
      var stateDTO = new StateDTO
      {
        StateId = state.StateId,
        Name = state.Name,
        Abbreviation = state.Abbreviation
      };

      return Ok(stateDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateState([FromBody] StateDTO stateCreate)
    {
      if(stateCreate == null || string.IsNullOrEmpty(stateCreate.Name) || string.IsNullOrEmpty(stateCreate.Abbreviation))
        return BadRequest();

      if(stateRepository.GetStateByName(stateCreate.Name.Trim()) != null)
        return Conflict("State already exists");

      var state = new State
      {
        StateId = Guid.NewGuid().ToString(),
        Name = stateCreate.Name,
        Abbreviation = stateCreate.Abbreviation
      };

      if(!stateRepository.CreateState(state))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{stateId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateState(string stateId, [FromBody] StateDTO stateUpdate)
    {
      if(stateUpdate == null || string.IsNullOrEmpty(stateUpdate.Name) || string.IsNullOrEmpty(stateUpdate.Abbreviation))
        return BadRequest();

      if(!stateRepository.StateExists(stateId))
        return NotFound();

      var state = stateRepository.GetState(stateId);
      state.Name = stateUpdate.Name;
      state.Abbreviation = stateUpdate.Abbreviation;

      if(!stateRepository.UpdateState(state))
        return StatusCode(500, "Something went wrong updating state");

      return NoContent();
    }

    [HttpDelete("{stateId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteState(string stateId)
    {
      if(!stateRepository.StateExists(stateId))
        return NotFound();

      var stateToDelete = stateRepository.GetState(stateId);
      if(!stateRepository.DeleteState(stateToDelete))
        return StatusCode(500, "Something went wrong deleting state");

      return NoContent();
    }
  }
}