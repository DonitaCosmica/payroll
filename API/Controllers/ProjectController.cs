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
  public class ProjectController(DataContext context, IProjectRepository projectRepository) : Controller
  {
    private readonly DataContext context = context;
    private readonly IProjectRepository projectRepository = projectRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<ProjectDTO>))]
    public IActionResult GetProjects()
    {
      var projects = projectRepository.GetProjects()
        .Select(MapToProjectDTORequest).ToList();

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
      Console.WriteLine($"Project: {projectCreate.Code}, {projectCreate.Name}, {projectCreate.StartDate}, {projectCreate.Status}, {projectCreate.Company}, {projectCreate.Description}");
      if(projectCreate == null)
        return BadRequest();

      var existingProject = projectRepository.GetProjects()
        .FirstOrDefault(c => c.Name.Trim().Equals(projectCreate.Name.Trim(), StringComparison.CurrentCultureIgnoreCase));

      if(existingProject != null)
        return Conflict("Project already exists");

      var query = from c in context.Companies
        join s in context.Statuses on projectCreate.Status equals s.StatusId
        select new
        {
          Company = c,
          Status = s
        };
      
      var result = query.FirstOrDefault();
      if(result == null)
        return StatusCode(500, "Something went wrong while fetching related data");
      
      var project = new Project
      {
        ProjectId = Guid.NewGuid().ToString(),
        Code = projectCreate.Code,
        Name = projectCreate.Name,
        StartDate = DateTime.ParseExact(projectCreate.StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
        StatusId = projectCreate.Status,
        Status = result.Status,
        CompanyId = projectCreate.Company,
        Company = result.Company,
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
      Console.WriteLine($"ProjectId: {projectUpdate.ProjectId}, Name: {projectUpdate.Name}");
      if(projectUpdate == null)
        return BadRequest();

      if(!projectRepository.ProjectExists(projectId))
        return NotFound();

      var project = projectRepository.GetProject(projectId);

      if(projectUpdate.Code == null || projectUpdate.Name == null || projectUpdate.Status == null || 
        projectUpdate.Company == null || projectUpdate.Description == null)
        return BadRequest();

      project.Code = projectUpdate.Code;
      project.Name = projectUpdate.Name;
      project.StartDate = projectUpdate.StartDate;
      project.Status = projectUpdate.Status;
      project.Company = projectUpdate.Company;
      project.Description = projectUpdate.Description;

      Console.WriteLine($"ProjectId: {project.ProjectId}, Name: {project.Name}");

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

      var projectDTO = new ProjectDTO();

      var query = from p in context.Projects
        join c in context.Companies on p.CompanyId equals c.CompanyId
        join s in context.Statuses on p.StatusId equals s.StatusId
        where p.ProjectId == project.ProjectId
        select new
        {
          Project = p,
          CompanyName = c.Name,
          StatusName = s.Name
        };

      var result = query.FirstOrDefault();
      if(result != null)
      {
        projectDTO.ProjectId = result.Project.ProjectId;
        projectDTO.Code = result.Project.Code;
        projectDTO.Name = result.Project.Name;
        projectDTO.StartDate = result.Project.StartDate.ToString("yyyy-MM-dd");
        projectDTO.Status = result.StatusName;
        projectDTO.Company = result.CompanyName;
        projectDTO.Description = result.Project.Description;
      }

      return projectDTO;
    }
  }
}