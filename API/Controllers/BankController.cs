using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;

namespace Payroll.Controllers
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
    public IActionResult GetBank(byte bankId)
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
    public IActionResult CreateReview()
    {
      return BadRequest("");
    }
  }
}