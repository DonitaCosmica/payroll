using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BankController(IBankRepository bankRepository) : Controller
  {
    private readonly IBankRepository bankRepository = bankRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<BankDTO>))]
    public IActionResult GetBanks()
    {
      var banks = bankRepository.GetBanks()
        .Select(b => new BankDTO
        {
          BankId = b.BankId,
          Name = b.Name
        }).ToList();

      return Ok(banks);
    }

    [HttpGet("{bankId}")]
    [ProducesResponseType(200, Type = typeof(BankDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetBank(string bankId)
    {
      if(!bankRepository.BankExists(bankId))
        return NotFound();

      var bank = bankRepository.GetBank(bankId);
      var bankDTO = new BankDTO
      {
        BankId = bank.BankId,
        Name = bank.Name
      };

      return Ok(bankDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateBank([FromBody] BankDTO bankCreate)
    {
      if(bankCreate == null || string.IsNullOrEmpty(bankCreate.Name))
        return BadRequest();

      if(bankRepository.GetBankByName(bankCreate.Name.Trim()) != null || string.IsNullOrEmpty(bankCreate.Code))
        return Conflict("Bank already exists");

      var bank = new Bank
      {
        BankId = Guid.NewGuid().ToString(),
        Name = bankCreate.Name,
        Code = bankCreate.Code
      };

      if(!bankRepository.CreateBank(bank))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{bankId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateBank(string bankId, [FromBody] BankDTO updateBank)
    {
      if(updateBank == null || string.IsNullOrEmpty(updateBank.Name) || string.IsNullOrEmpty(updateBank.Code))
        return BadRequest();

      var bank = bankRepository.GetBank(bankId);
      if(bank == null)
        return NotFound();

      bank.Name = updateBank.Name;
      bank.Code = updateBank.Code;

      if(!bankRepository.UpdateBank(bank))
        return StatusCode(500, "Something went wrong updating bank");

      return NoContent();
    }

    [HttpDelete("{bankId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteBank(string bankId)
    {
      if(!bankRepository.BankExists(bankId))
        return NotFound();
      
      if(!bankRepository.DeleteBank(bankRepository.GetBank(bankId)))
        return StatusCode(500, "Something went wrong deleting bank");

      return NoContent();
    }
  }
}