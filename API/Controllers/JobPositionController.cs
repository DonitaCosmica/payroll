using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class JobPositionController(IJobPositionRepository jobPositionRepository, IDepartmentRepository departmentRepository) : Controller
  {
    private readonly IJobPositionRepository jobPositionRepository = jobPositionRepository;
    private readonly IDepartmentRepository departmentRepository = departmentRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<JobPositionDTO>))]
    public IActionResult GetJobPositions()
    {
      List<JobPositionDTO> jobPositions = [.. jobPositionRepository.GetJobPositions()
        .Select(jp => new JobPositionDTO
        {
          JobPositionId = jp.JobPositionId,
          Name = jp.Name,
          Department = jp.Department.Name
        })];

      List<string> columns = jobPositionRepository.GetColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = jobPositions,
        FormData = jobPositions
      };

      return Ok(result);
    }

    [HttpGet("by")]
    [ProducesResponseType(200, Type = typeof(Department))]
    [ProducesResponseType(400)]
    public IActionResult GetDepartmentByJobPosition([FromQuery] string jobPositionId)
    {
      if(!jobPositionRepository.JobPositionExists(jobPositionId))
        return NotFound();

      Department department = jobPositionRepository.GetJobPosition(jobPositionId).Department;
      DepartmentDTO departmentDTO = new()
      {
        DepartmentId = department.DepartmentId,
        Name = department.Name,
        SubContract = department.SubContract,
        TotalEmployees = department.TotalEmployees
      };

      return Ok(departmentDTO);
    }

    [HttpGet("{jobPositionId}")]
    [ProducesResponseType(200, Type = typeof(JobPositionDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetJobPosition(string jobPositionId)
    {
      if(!jobPositionRepository.JobPositionExists(jobPositionId))
        return NotFound();

      JobPosition jobPosition = jobPositionRepository.GetJobPosition(jobPositionId);
      JobPositionDTO jobPositionDTO = new()
      {
        JobPositionId = jobPosition.JobPositionId,
        Name = jobPosition.Name,
        Department = jobPosition.Department.Name
      };

      return Ok(jobPositionDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateJobPosition([FromBody] JobPositionDTO jobPositionCreate)
    {
      if(jobPositionCreate == null || !departmentRepository.DepartmentExists(jobPositionCreate.Department) || string.IsNullOrEmpty(jobPositionCreate.Name))
        return BadRequest();

      if(jobPositionRepository.GetJobPositionByName(jobPositionCreate.Name.Trim()) != null)
        return Conflict("Job Position already exists");

      JobPosition jobPosition = new()
      {
        JobPositionId = Guid.NewGuid().ToString(),
        Name = jobPositionCreate.Name,
        DepartmentId = jobPositionCreate.Department,
        Department = departmentRepository.GetDepartment(jobPositionCreate.Department)
      };

      if(!jobPositionRepository.CreateJobPosition(jobPosition))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPost("csv")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult UpdateJobPositions([FromBody] IEnumerable<JobPositionDTO> jobPositions)
    {
      if(jobPositions == null || !jobPositions.Any())
        return BadRequest(new { success = false, message = "No job positions provided." });

      foreach(JobPositionDTO jobPosition in jobPositions)
      {
        if(jobPosition == null || !departmentRepository.DepartmentExists(jobPosition.Department) || string.IsNullOrEmpty(jobPosition.Name))
          return BadRequest(new { success = false, message = "Invalid data for one or more job positions." });

        JobPosition? existingJobPosition = jobPositionRepository.GetJobPositionByName(jobPosition.Name.Trim());
        if(existingJobPosition == null)
        {
          JobPosition newJobPosition = new()
          {
            JobPositionId = Guid.NewGuid().ToString(),
            Name = jobPosition.Name,
            DepartmentId = jobPosition.Department,
            Department = departmentRepository.GetDepartment(jobPosition.Department)
          };

          if(!jobPositionRepository.CreateJobPosition(newJobPosition))
            return StatusCode(500, "Something went wrong while saving");
        }
        else
        {
          existingJobPosition.Name = jobPosition.Name;
          existingJobPosition.DepartmentId = jobPosition.Department;
          
          if(existingJobPosition.Department == null || existingJobPosition.Department.DepartmentId != jobPosition.Department)
            existingJobPosition.Department = departmentRepository.GetDepartment(jobPosition.Department);

          if(!jobPositionRepository.UpdateJobPosition(existingJobPosition))
            return StatusCode(500, "Something went wrong updating Job Position");
        }
      }
      
      return Ok(new { success = true, message = "Job Positions processed successfully." });
    }

    [HttpPatch("{jobPositionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateJobPosition(string jobPositionId, [FromBody] JobPositionDTO jobPositionUpdate)
    {
      if(jobPositionUpdate == null || !departmentRepository.DepartmentExists(jobPositionUpdate.Department) || string.IsNullOrEmpty(jobPositionUpdate.Name))
        return BadRequest();

      if(!jobPositionRepository.JobPositionExists(jobPositionId))
        return NotFound();

      JobPosition jobPosition = jobPositionRepository.GetJobPosition(jobPositionId);
      jobPosition.Name = jobPositionUpdate.Name;
      jobPosition.DepartmentId = jobPositionUpdate.Department;
      
      if(jobPosition.Department == null || jobPosition.Department.DepartmentId != jobPositionUpdate.Department)
        jobPosition.Department = departmentRepository.GetDepartment(jobPositionUpdate.Department);

      if(!jobPositionRepository.UpdateJobPosition(jobPosition))
        return StatusCode(500, "Something went wrong updating Job Position");

      return NoContent();
    }

    [HttpDelete("{jobPositionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteJobPosition(string jobPositionId)
    {
      if(!jobPositionRepository.JobPositionExists(jobPositionId))
        return BadRequest();
      
      JobPosition jobPositionToDelete = jobPositionRepository.GetJobPosition(jobPositionId);
      if(!jobPositionRepository.DeleteJobPosition(jobPositionToDelete))
        return StatusCode(500, "Something went wrong while deleting Job Position");

      return NoContent();
    }
  }
}