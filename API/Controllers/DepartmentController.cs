using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace API.Controllers
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
      List<DepartmentDTO> departments = departmentRepository.GetDepartments()
        .Select(d => new DepartmentDTO
        {
          DepartmentId = d.DepartmentId,
          Name = d.Name,
          TotalEmployees = d.TotalEmployees,
          SubContract = d.SubContract
        }).ToList();

      List<string> columns = departmentRepository.GetColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = departments,
        FormData = departments
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

      Department department = departmentRepository.GetDepartment(departmentId);
      DepartmentDTO departmentDTO = new()
      {
        DepartmentId = department.DepartmentId,
        Name = department.Name,
        TotalEmployees = department.TotalEmployees,
        SubContract = department.SubContract
      };

      return Ok(departmentDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateDepartment([FromBody] DepartmentDTO departmentCreate)
    {
      if(departmentCreate == null || departmentCreate.TotalEmployees < 0 || string.IsNullOrEmpty(departmentCreate.Name))
        return BadRequest();

      if(departmentRepository.GetDepartmentByName(departmentCreate.Name.Trim()) != null)
        return Conflict("Department already exists");

      Department department = new()
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

    [HttpPost("csv")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult UpdateDepartments([FromBody] IEnumerable<DepartmentDTO> departments)
    {
      if(departments == null || !departments.Any())
        return BadRequest(new { success = false, message = "No departments provided." });

      foreach(DepartmentDTO department in departments)
      {
        if(department == null || department.TotalEmployees < 0 || string.IsNullOrEmpty(department.Name))
          return BadRequest(new { success = false, message = "Invalid data for one or more departments." });
      
        Department? existingDepartment = departmentRepository.GetDepartmentByName(department.Name.Trim());
        if(existingDepartment == null)
        {
          Department newDepartment = new()
          {
            DepartmentId = Guid.NewGuid().ToString(),
            Name = department.Name,
            TotalEmployees = 0,
            SubContract = department.SubContract
          };

          if(!departmentRepository.CreateDepartment(newDepartment))
            return StatusCode(500, "Something went wrong while saving");
        }
        else
        {
          existingDepartment.Name = department.Name;
          existingDepartment.TotalEmployees = department.TotalEmployees ?? 0;
          existingDepartment.SubContract = department.SubContract;

          if(!departmentRepository.UpdateDepartment(existingDepartment))
            return StatusCode(500, "Something went wrong updating department");
        }
      }

      return Ok(new { success = true, message = "Departments processed successfully." });
    }

    [HttpPatch("{departmentId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateDepartment(string departmentId, [FromBody] DepartmentDTO departmentUpdate)
    {
      if(departmentUpdate == null || departmentUpdate.TotalEmployees < 0 || string.IsNullOrEmpty(departmentUpdate.Name))
        return BadRequest();

      if(!departmentRepository.DepartmentExists(departmentId))
        return NotFound();

      Department department = departmentRepository.GetDepartment(departmentId);
      department.Name = departmentUpdate.Name;
      department.TotalEmployees = departmentUpdate.TotalEmployees ?? 0;
      department.SubContract = departmentUpdate.SubContract;

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

      Department departmentToDelete = departmentRepository.GetDepartment(departmentId);
      if(!departmentRepository.DeleteDepartment(departmentToDelete))
        return StatusCode(500, "Something went wrong deleting department");

      return NoContent();
    }
  }
}