using Microsoft.AspNetCore.Mvc;
using Payroll.Data;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BankController(DataContext context) : Controller
  {
    private readonly DataContext context = context;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<Bank>))]
    public ActionResult<IEnumerable<Bank>> GetBanks()
    {
      return context.Banks.ToList();
    }
  }
}