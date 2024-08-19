using API.DTO;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PayrollController(IPayrollRepository payrollRepository) : Controller
  {
    private readonly IPayrollRepository payrollRepository = payrollRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<PayrollDTO>))]
    public IActionResult GetPayrolls()
    {
      var payrolls = payrollRepository.GetPayrolls()
        .Select(pr => new PayrollDTO
        {
          PayrollId = pr.PayrollId,
          Name = pr.Name
        }).ToList();

      return Ok(payrolls);
    }

    [HttpGet("{payrollId}")]
    [ProducesResponseType(200, Type = typeof(PayrollDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetPayroll(string payrollId)
    {
      if(!payrollRepository.PayrollExists(payrollId))
        return NotFound();

      var payroll = payrollRepository.GetPayroll(payrollId);
      var payrollDTO = new PayrollDTO
      {
        PayrollId = payroll.PayrollId,
        Name = payroll.Name
      };

      return Ok(payrollDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreatePayroll([FromBody] PayrollDTO createPayroll)
    {
      if(createPayroll == null)
        return BadRequest();

      var payroll = new Payroll
      {
        PayrollId = Guid.NewGuid().ToString(),
        Name = createPayroll.Name
      };

      if(!payrollRepository.CreatePayroll(payroll))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{payrollId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdatePayroll(string payrollId, [FromBody] PayrollDTO updatePayroll)
    {
      if(updatePayroll == null)
        return BadRequest();

      var payroll = payrollRepository.GetPayroll(payrollId);
      if(payroll == null)
        return NotFound("Payroll Not Found");

      payroll.Name = updatePayroll.Name;

      if(!payrollRepository.UpdatePayroll(payroll))
        return StatusCode(500, "Something went wrong updating payroll");

      return NoContent();
    }

    [HttpDelete("{payrollId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeletePayroll(string payrollId)
    {
      if(!payrollRepository.PayrollExists(payrollId))
        return NotFound();

      if(!payrollRepository.DeletePayroll(payrollRepository.GetPayroll(payrollId)))
        return StatusCode(500, "Something went wrong deleting payroll");

      return NoContent();
    }
  }
}