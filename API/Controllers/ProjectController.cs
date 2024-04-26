using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProjectController(IProjectRepository projectRepository, IStatusRepository statusRepository) : Controller
  {
    private readonly IProjectRepository projectRepository = projectRepository;
    private readonly IStatusRepository statusRepository = statusRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<ProjectDTO>))]
    public IActionResult GetProjects()
    {
      var projects = projectRepository.GetProjects()
        .Select(p => new ProjectDTO
        {
          ProjectId = p.ProjectId,
          Code = p.Code,
          Name = p.Name,
          StartDate = p.StartDate,
          StatusId = p.StatusId,
          Description = p.Description
        }).ToList();

      return Ok(projects);
    }

    [HttpGet("{projectId}")]
    [ProducesResponseType(200, Type = typeof(ProjectDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetProject(string projectId)
    {
      if(!projectRepository.ProjectExists(projectId))
        return NotFound();

      var project = projectRepository.GetProject(projectId);
      var projectDTO = new ProjectDTO
      {
        ProjectId = project.ProjectId,
        Code = project.Code,
        Name = project.Name,
        StartDate = project.StartDate,
        StatusId = project.StatusId,
        Description = project.Description
      };

      return Ok(projectDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateProject([FromBody] ProjectDTO projectCreate)
    {
      if(projectCreate == null || !statusRepository.StatusExists(projectCreate.StatusId))
        return BadRequest();

      var existingProject = projectRepository.GetProjects()
        .FirstOrDefault(c => c.Name.Trim().Equals(projectCreate.Name.Trim(), StringComparison.CurrentCultureIgnoreCase));

      if(existingProject != null)
        return Conflict("Project already exists");

      var status = statusRepository.GetStatus(projectCreate.StatusId);

      var project = new Project
      {
        ProjectId = Guid.NewGuid().ToString(),
        Code = projectCreate.Code,
        Name = projectCreate.Name,
        StartDate = DateTime.Now,
        StatusId = projectCreate.StatusId,
        Status = status,
        Description = projectCreate.Description
      };

      if(!projectRepository.CreateProject(project))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{projectId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateProject(string projectId, [FromBody] Project projectUpdate)
    {
      if(projectUpdate == null || projectId != projectUpdate.ProjectId || !statusRepository.StatusExists(projectUpdate.StatusId))
        return BadRequest();

      if(!projectRepository.ProjectExists(projectId))
        return NotFound();

      var project = projectRepository.GetProject(projectId);

      if(!projectRepository.UpdateProject(project))
        return StatusCode(500, "Something went wrong updating Project");

      return NoContent();
    }

    [HttpDelete("{projectId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteProject(string projectId)
    {
      if(!projectRepository.ProjectExists(projectId))
        return BadRequest();

      var projectToDelete = projectRepository.GetProject(projectId);

      if(!projectRepository.DeleteProject(projectToDelete))
        return StatusCode(500, "sOmething went wrong while deleting Project");

      return NoContent();
    }
  }
}