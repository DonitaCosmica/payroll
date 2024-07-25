using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Payroll.Data;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProjectController(IProjectRepository projectRepository) : Controller
  {
    private readonly IProjectRepository projectRepository = projectRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<ProjectDTO>))]
    public IActionResult GetProjects()
    {
      var projects = projectRepository.GetProjects().Select(MapToProjectDTORequest).ToList();
      var result = new
      {
        Columns = projectRepository.GetColumns(),
        Projects = projects
      };

      return Ok(result);
    }

    [HttpGet("{projectId}")]
    [ProducesResponseType(200, Type = typeof(ProjectDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetProject(string projectId)
    {
      if(!projectRepository.ProjectExists(projectId))
        return NotFound();

      var project = projectRepository.GetProject(projectId);
      var projectDTO = MapToProjectDTORequest(project);
      var result = new
      {
        Columns = projectRepository.GetColumns(),
        Project = projectDTO
      };

      return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateProject([FromBody] ProjectDTO projectCreate)
    {
      if(projectCreate == null || string.IsNullOrEmpty(projectCreate.Code) || string.IsNullOrEmpty(projectCreate.Name) || string.IsNullOrEmpty(projectCreate.Description))
        return BadRequest();

      if(projectRepository.GetProjectByName(projectCreate.Name.Trim()) != null)
        return Conflict("Project already exists");

      var relatedEntities = projectRepository.GetRelatedEntities(projectCreate.Company, projectCreate.Status);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");
      
      var (company, status) = relatedEntities.Value;
      var project = new Project
      {
        ProjectId = Guid.NewGuid().ToString(),
        Code = projectCreate.Code,
        Name = projectCreate.Name,
        StartDate = DateTime.ParseExact(projectCreate.StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
        StatusId = projectCreate.Status,
        Status = status,
        CompanyId = projectCreate.Company,
        Company = company,
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
    public IActionResult UpdateProject(string projectId, [FromBody] ProjectDTO projectUpdate)
    {
      if(projectUpdate == null || string.IsNullOrEmpty(projectUpdate.Code) || string.IsNullOrEmpty(projectUpdate.Name) || string.IsNullOrEmpty(projectUpdate.Description))
        return BadRequest();

      if(!projectRepository.EntitiesExist(projectUpdate.Company, projectUpdate.Status))
        return BadRequest();

      var project = projectRepository.GetProject(projectId);
      if (project == null)
        return NotFound("Project not found");

      var relatedEntities = projectRepository.GetRelatedEntities(projectUpdate.Company, projectUpdate.Status);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      var (company, status) = relatedEntities.Value;
      project.Code = projectUpdate.Code;
      project.Name = projectUpdate.Name;
      project.StartDate = DateTime.ParseExact(projectUpdate.StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      project.StatusId = projectUpdate.Status;
      project.Status = status;
      project.CompanyId = projectUpdate.Company;
      project.Company = company;
      project.Description = projectUpdate.Description;

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

    private ProjectDTO MapToProjectDTORequest(Project? project)
    {
      if (project == null)
        return new ProjectDTO();
        
      return new ProjectDTO
      {
        ProjectId = project.ProjectId,
        Code = project.Code,
        Name = project.Name,
        StartDate = project.StartDate.ToString("yyyy-MM-dd"),
        Status = project.Status.Name,
        Company = project.Company.Name,
        Description = project.Description
      };
    }
  }
}