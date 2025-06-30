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
      List<BankDTO> banks = [.. bankRepository.GetBanks()
        .Select(b => new BankDTO
        {
          BankId = b.BankId,
          Name = b.Name,
          Code = b.Code
        })];

      return Ok(banks);
    }

    [HttpGet("{bankId}")]
    [ProducesResponseType(200, Type = typeof(BankDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetBank(string bankId)
    {
      if(!bankRepository.BankExists(bankId))
        return NotFound();

      Bank bank = bankRepository.GetBank(bankId);
      BankDTO bankDTO = new()
      {
        BankId = bank.BankId,
        Name = bank.Name,
        Code = bank.Code
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

      if(bankRepository.GetBankByName(bankCreate.Name.Trim()) != null
        || bankRepository.GetBankByCode(bankCreate.Code) != null
        || string.IsNullOrEmpty(bankCreate.Code))
        return Conflict("Bank already exists");

      Bank bank = new()
      {
        BankId = Guid.NewGuid().ToString(),
        Name = bankCreate.Code + " - " + bankCreate.Name,
        Code = bankCreate.Code
      };

      if(!bankRepository.CreateBank(bank))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPost("csv")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult UpdateBanks([FromBody] IEnumerable<BankDTO> banks)
    {
      if(banks == null || !banks.Any())
        return BadRequest(new { success = false, message = "No banks provided." });

      foreach(var bank in banks)
      {
        if (string.IsNullOrEmpty(bank.Name) || string.IsNullOrEmpty(bank.Code))
          return BadRequest(new { success = false, message = "Invalid data for one or more banks." });

        Bank? existingBank = bankRepository.GetBankByName(bank.Name);
        if(existingBank == null)
        {
          Bank newBank = new()
          {
            BankId = Guid.NewGuid().ToString(),
            Name = bank.Code + " - " + bank.Name,
            Code = bank.Code
          };

          if(!bankRepository.CreateBank(newBank))
            return StatusCode(500, new { success = false, message = "Error creating a bank." });
        }
        else
        {
          existingBank.Name = bank.Code + " - " + bank.Name;
          existingBank.Code = bank.Code;

          if (!bankRepository.UpdateBank(existingBank))
            return StatusCode(500, new { success = false, message = "Error updating a bank." });
        }
      }

      return Ok(new { success = true, message = "Banks processed successfully." });
    }

    [HttpPatch("{bankId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateBank(string bankId, [FromBody] BankDTO updateBank)
    {
      if(updateBank == null || string.IsNullOrEmpty(updateBank.Name) || string.IsNullOrEmpty(updateBank.Code))
        return BadRequest();

      Bank bank = bankRepository.GetBank(bankId);
      if(bank == null)
        return NotFound();

      bank.Name = updateBank.Code + " - " + updateBank.Name;
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