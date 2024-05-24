using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
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
      var jobPositions = jobPositionRepository.GetJobPositions()
        .Select(jp => new JobPositionDTO
        {
          JobPositionId = jp.JobPositionId,
          Name = jp.Name,
          Department = departmentRepository.GetDepartment(jp.DepartmentId).Name
        }).ToList();

      var result = new
      {
        Columns = jobPositionRepository.GetColumns(),
        JobPositions = jobPositions
      };

      return Ok(result);
    }

    [HttpGet("{jobPositionId}")]
    [ProducesResponseType(200, Type = typeof(JobPositionDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetJobPosition(string jobPositionId)
    {
      if(!jobPositionRepository.JobPositionExists(jobPositionId))
        return NotFound();

      var jobPosition = jobPositionRepository.GetJobPosition(jobPositionId);
      var jobPositionDTO = new JobPositionDTO
      {
        JobPositionId = jobPosition.JobPositionId,
        Name = jobPosition.Name,
        Department = departmentRepository.GetDepartment(jobPosition.DepartmentId).Name
      };

      var result = new
      {
        Columns = jobPositionRepository.GetColumns(),
        JobPosition = jobPositionDTO
      };

      return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateJobPosition([FromBody] JobPositionDTO jobPositionCreate)
    {
      if(jobPositionCreate == null || !departmentRepository.DepartmentExists(jobPositionCreate.Department))
        return BadRequest();

      var existingJobPosition = jobPositionRepository.GetJobPositions()
        .FirstOrDefault(jp => jp.Name.Trim().Equals(jobPositionCreate.Name.Trim(), StringComparison.CurrentCultureIgnoreCase));

      if(existingJobPosition != null)
        return Conflict("Job Position already exists");

      var department = departmentRepository.GetDepartment(jobPositionCreate.Department);

      var jobPosition = new JobPosition
      {
        JobPositionId = Guid.NewGuid().ToString(),
        Name = jobPositionCreate.Name,
        DepartmentId = jobPositionCreate.Department,
        Department = department
      };

      if(!jobPositionRepository.CreateJobPosition(jobPosition))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{jobPositionId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateJobPosition(string jobPositionId, [FromBody] JobPositionDTO jobPositionUpdate)
    {
      if(jobPositionUpdate == null || !departmentRepository.DepartmentExists(jobPositionUpdate.Department))
        return BadRequest();

      if(!jobPositionRepository.JobPositionExists(jobPositionId))
        return NotFound();

      var jobPosition = jobPositionRepository.GetJobPosition(jobPositionId);

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
      
      var jobPositionToDelete = jobPositionRepository.GetJobPosition(jobPositionId);

      if(!jobPositionRepository.DeleteJobPosition(jobPositionToDelete))
        return StatusCode(500, "Something went wrong while deleting Job Position");

      return NoContent();
    }
  }
}