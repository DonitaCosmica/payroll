using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ContractController(IContractRepository contractRepository) : Controller
  {
    private readonly IContractRepository contractRepository = contractRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<ContractDTO>))]
    public IActionResult GetContracts()
    {
      var contracts = contractRepository.GetContracts()
        .Select(ct => new ContractDTO
        {
          ContractId = ct.ContractId,
          Name = ct.Name
        });

      return Ok(contracts);
    }

    [HttpGet("{contractId}")]
    [ProducesResponseType(200, Type = typeof(ContractDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetContract(string contractId)
    {
      if(!contractRepository.ContractExists(contractId))
        return NotFound();
      
      var contract = contractRepository.GetContract(contractId);
      var contractDTO = new ContractDTO
      {
        ContractId = contract.ContractId,
        Name = contract.Name
      };

      return Ok(contractDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateContract([FromBody] ContractDTO contractCreate)
    {
      if(contractCreate == null || string.IsNullOrEmpty(contractCreate.Name))
        return BadRequest();

      if(contractRepository.GetContractByName(contractCreate.Name.Trim()) != null)
        return Conflict("Contract already exists");

      var contract = new Contract
      {
        ContractId = Guid.NewGuid().ToString(),
        Name = contractCreate.Name
      };

      if(!contractRepository.CreateContract(contract))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{contractId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateContract(string contractId, [FromBody] ContractDTO updateContract)
    {
      if(updateContract == null || string.IsNullOrEmpty(updateContract.Name))
        return BadRequest();

      if(!contractRepository.ContractExists(contractId))
        return NotFound();

      var contract = contractRepository.GetContract(contractId);
      contract.Name = updateContract.Name;

      if(!contractRepository.UpdateContract(contract))
        return StatusCode(500, "Something went wrong updating contract");

      return NoContent();
    }

    [HttpDelete("{contractId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteContract(string contractId)
    {
      if(!contractRepository.ContractExists(contractId))
        return NotFound();

      var contractToDelete = contractRepository.GetContract(contractId);
      if(!contractRepository.DeleteContract(contractToDelete))
        return StatusCode(500, "Something went wrong deleting contract");

      return NoContent();
    }
  }
}