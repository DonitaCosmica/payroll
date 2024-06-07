using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

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
          TotalEmployees = d.TotalEmployees,
          SubContract = d.SubContract
        }).ToList();

      var result = new
      {
        Columns = departmentRepository.GetColumns(),
        Departments = departments
      };

      return Ok(result);
    }

    [HttpGet("{departmentId}")]
    [ProducesResponseType(200, Type = typeof(DepartmentDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetDepartment(string departmentId)
    {
      if(!departmentRepository.DepartmentExists(departmentId))
        return NotFound();

      var department = departmentRepository.GetDepartment(departmentId);
      var departmentDTO = new DepartmentDTO
      {
        DepartmentId = department.DepartmentId,
        Name = department.Name,
        TotalEmployees = department.TotalEmployees,
        SubContract = department.SubContract
      };

      var result = new
      {
        Columns = departmentRepository.GetColumns(),
        Department = departmentDTO
      };

      return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateDepartment([FromBody] DepartmentDTO departmentCreate)
    {
      if(departmentCreate == null)
        return BadRequest();

      var existingDepartment = departmentRepository.GetDepartments()
        .FirstOrDefault(d => d.Name.Trim().Equals(departmentCreate.Name.Trim(), StringComparison.CurrentCultureIgnoreCase));

      if(existingDepartment != null)
        return Conflict("Department already exists");

      var department = new Department
      {
        DepartmentId = Guid.NewGuid().ToString(),
        Name = departmentCreate.Name,
        TotalEmployees = 0,
        SubContract = departmentCreate.SubContract
      };

      if(!departmentRepository.CreateDepartment(department))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{departmentId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateDepartment(string departmentId, [FromBody] DepartmentDTO departmentUpdate)
    {
      if(departmentUpdate == null)
        return BadRequest();

      if(!departmentRepository.DepartmentExists(departmentId))
        return NotFound();

      var department = departmentRepository.GetDepartment(departmentId);

      if(departmentUpdate.Name != null && departmentUpdate.TotalEmployees >= 0)
      {
        department.Name = departmentUpdate.Name;
        department.TotalEmployees = departmentUpdate.TotalEmployees;
        department.SubContract = departmentUpdate.SubContract;
      }

      if(!departmentRepository.UpdateDepartment(department))
        return StatusCode(500, "Something went wrong updating department");

      return NoContent();
    }

    [HttpDelete("{departmentId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteDepartment(string departmentId)
    {
      if(!departmentRepository.DepartmentExists(departmentId))
        return NotFound();

      var departmentToDelete = departmentRepository.GetDepartment(departmentId);

      if(!departmentRepository.DeleteDepartment(departmentToDelete))
        return StatusCode(500, "Something went wrong deleting department");

      return NoContent();
    }
  }
}