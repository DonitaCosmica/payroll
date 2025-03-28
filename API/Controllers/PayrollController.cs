using API.DTO;
using API.Enums;
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
      List<PayrollDTO> payrolls = [.. payrollRepository.GetPayrolls()
        .Select(pr => new PayrollDTO
        {
          PayrollId = pr.PayrollId,
          Name = pr.Name,
          PayrollType = pr.PayrollType.ToString()
        })];

      return Ok(payrolls);
    }

    [HttpGet("{payrollId}")]
    [ProducesResponseType(200, Type = typeof(PayrollDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetPayroll(string payrollId)
    {
      if(!payrollRepository.PayrollExists(payrollId))
        return NotFound();

      Payroll payroll = payrollRepository.GetPayrollById(payrollId);
      PayrollDTO payrollDTO = new()
      {
        PayrollId = payroll.PayrollId,
        Name = payroll.Name
      };

      return Ok(payrollDTO);
    }

    [HttpGet("by")]
    [ProducesResponseType(200, Type = typeof(PayrollDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetPrincipalPayroll([FromQuery] string payrollType)
    {
      if(!payrollRepository.PrimaryPayrollExists() && payrollType != "Principal")
        return NotFound();

      Payroll payroll = payrollRepository.GetPrincipalPayroll();
      PayrollDTO payrollDTO = new()
      {
        PayrollId = payroll.PayrollId,
        Name = payroll.Name,
        PayrollType = payroll.PayrollType.ToString()
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

      if(string.IsNullOrEmpty(createPayroll.PayrollType) || !TryConvertToPayrollType(createPayroll.PayrollType, out PayrollType payrollType))
        payrollType = PayrollType.Error;

      if(payrollType == PayrollType.Principal && payrollRepository.PrimaryPayrollExists())
        return Conflict("There is already a principal payroll");
      
      Payroll payroll = new()
      {
        PayrollId = Guid.NewGuid().ToString(),
        Name = createPayroll.Name,
        PayrollType = payrollType
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

      if(string.IsNullOrEmpty(updatePayroll.PayrollType) || !TryConvertToPayrollType(updatePayroll.PayrollType, out PayrollType payrollType))
        payrollType = PayrollType.Error;

      if(payrollType == PayrollType.Principal && payrollRepository.PrimaryPayrollExists())
        return Conflict("There is already a principal payroll");

      Payroll payroll = payrollRepository.GetPayrollById(payrollId);
      if(payroll == null)
        return NotFound("Payroll Not Found");

      payroll.Name = updatePayroll.Name;
      payroll.PayrollType = payrollType;

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

      if(!payrollRepository.DeletePayroll(payrollRepository.GetPayrollById(payrollId)))
        return StatusCode(500, "Something went wrong deleting payroll");

      return NoContent();
    }

    private static bool TryConvertToPayrollType<TEnum>(string value, out TEnum enumValue) where TEnum : struct, Enum =>
      Enum.TryParse(value, ignoreCase: true, out enumValue);
  }
}