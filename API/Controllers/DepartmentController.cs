using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class DepartmentController(IDepartmentRepository departmentRepository) : Controller
  {
    private readonly IDepartmentRepository departmentRepository = departmentRepository;
  
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<DepartmentDTO>))]
    public IActionResult GetDepartments()
    {
      var departments = departmentRepository.GetDepartments()
        .Select(d => new DepartmentDTO
        {
          DepartmentId = d.DepartmentId,
          Name = d.Name,
          TotalEmployees = d.TotalEmployees
        }).ToList();

      return Ok(departments);
    }
  }
}