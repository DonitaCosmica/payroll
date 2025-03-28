using API.DTO;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AccountController(IAccountRepository accountRepository) : Controller
  {
    private readonly IAccountRepository accountRepository = accountRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<AccountDTO>))]
    public IActionResult GetAccounts()
    {
      List<AccountDTO> accounts = [.. accountRepository.GetAccounts()
        .Select(a => new AccountDTO
        {
          AccountId = a.AccountId,
          AccountNumber = a.AccountNumber,
          Name = a.Name,
          Reference = a.Reference,
          RFC = a.RFC
        })];

      return Ok(accounts);
    }

    [HttpGet("{accountId}")]
    [ProducesResponseType(200, Type = typeof(AccountDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetAccount(string accountId)
    {
      if(!accountRepository.AccountExists(accountId))
        return NotFound();

      Account account = accountRepository.GetAccount(accountId);
      AccountDTO accountDTO = new()
      {
        AccountId = account.AccountId,
        AccountNumber = account.AccountNumber,
        Name = account.Name,
        Reference = account.Reference,
        RFC = account.RFC
      };

      return Ok(accountDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateAccount([FromBody] AccountDTO accountCreate)
    {
      if(accountCreate == null || string.IsNullOrEmpty(accountCreate.Name) || string.IsNullOrEmpty(accountCreate.RFC))
        return BadRequest();

      if(accountRepository.GetAccountByName(accountCreate.Name.Trim()) != null)
        return Conflict("Account already exists");

      Account account = new()
      {
        AccountId = Guid.NewGuid().ToString(),
        AccountNumber = accountCreate.AccountNumber,
        Name = accountCreate.Name,
        Reference = accountCreate.Reference,
        RFC = accountCreate.RFC
      };

      if(!accountRepository.CreateAccount(account))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{accountId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateAccount(string accountId, [FromBody] AccountDTO updateAccount)
    {
      if(updateAccount == null || string.IsNullOrEmpty(updateAccount.Name) || string.IsNullOrEmpty(updateAccount.RFC))
        return BadRequest();

      Account account = accountRepository.GetAccount(accountId);
      if(account == null)
        return NotFound();

      account.AccountNumber = updateAccount.AccountNumber;
      account.Name = updateAccount.Name;
      account.Reference = updateAccount.Reference;
      account.RFC = updateAccount.RFC;

      if(!accountRepository.UpdateAccount(account))
        return StatusCode(500, "Something went wrong updating account");

      return NoContent();
    }

    [HttpDelete("{accountId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteAccount(string accountId)
    {
      if(!accountRepository.AccountExists(accountId))
        return NotFound();

      if(!accountRepository.DeleteAccount(accountRepository.GetAccount(accountId)))
        return StatusCode(500, "Something went wrong deleting account");

      return NoContent();
    }
  }
}