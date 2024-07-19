using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public async Task<IActionResult> GetProjects()
    {
      var projects = await projectRepository.GetProjects();
      var projectDTOs = await Task.WhenAll(projects.Select(p => MapToProjectDTORequest(p)));

      var result = new
      {
        Columns = await projectRepository.GetColumns(),
        Projects = projects
      };

      return Ok(result);
    }

    [HttpGet("{projectId}")]
    [ProducesResponseType(200, Type = typeof(ProjectDTO))]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetProject(string projectId)
    {
      if(!await projectRepository.ProjectExistsAsync(projectId))
        return NotFound();

      var project = await projectRepository.GetProject(projectId);
      var projectDTO = await MapToProjectDTORequest(project);
      var result = new
      {
        Columns = await projectRepository.GetColumns(),
        Project = projectDTO
      };

      return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateProject([FromBody] ProjectDTO projectCreate)
    {
      if(projectCreate == null)
        return BadRequest();

      var existingProjects = await projectRepository.GetProjects();
      var existingProject = existingProjects.FirstOrDefault(c => c.Name.Trim().Equals(projectCreate.Name.Trim(), StringComparison.CurrentCultureIgnoreCase));

      if(existingProject != null)
        return Conflict("Project already exists");

      var result = await (from c in context.Companies
        join s in context.Statuses on projectCreate.Status equals s.StatusId
        select new { Company = c, Status = s })
        .FirstOrDefaultAsync();
      
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

      if(!await projectRepository.CreateProject(project))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{projectId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateProject(string projectId, [FromBody] ProjectDTO projectUpdate)
    {
      if(projectUpdate == null)
        return BadRequest();

      if(string.IsNullOrEmpty(projectUpdate.Code) || string.IsNullOrEmpty(projectUpdate.Name) || string.IsNullOrEmpty(projectUpdate.Description))
        return BadRequest();

      if(!await projectRepository.ProjectExistsAsync(projectId))
        return NotFound();

      var project = await projectRepository.GetProject(projectId);
      if (project == null)
        return NotFound("Project not found");

      var result = await (from c in context.Companies
        join s in context.Statuses on projectUpdate.Status equals s.StatusId
        select new { Company = c, Status = s })
        .FirstOrDefaultAsync();

      if(result == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      project.Code = projectUpdate.Code;
      project.Name = projectUpdate.Name;
      project.StartDate = DateTime.ParseExact(projectUpdate.StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      project.Status = result.Status;
      project.Company = result.Company;
      project.Description = projectUpdate.Description;

      if(!await projectRepository.UpdateProject(project))
        return StatusCode(500, "Something went wrong updating Project");

      return NoContent();
    }

    [HttpDelete("{projectId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> DeleteProject(string projectId)
    {
      if(!await projectRepository.ProjectExistsAsync(projectId))
        return BadRequest();

      var projectToDelete = await projectRepository.GetProject(projectId);

      if(!await projectRepository.DeleteProject(projectToDelete))
        return StatusCode(500, "sOmething went wrong while deleting Project");

      return NoContent();
    }

    private async Task<ProjectDTO> MapToProjectDTORequest(Project? project)
    {
      if (project == null)
        return new ProjectDTO();

      var projectDTO = new ProjectDTO();

      var result = await (from p in context.Projects
        join c in context.Companies on p.CompanyId equals c.CompanyId
        join s in context.Statuses on p.StatusId equals s.StatusId
        where p.ProjectId == project.ProjectId
        select new { Project = p, CompanyName = c.Name, StatusName = s.Name })
        .FirstOrDefaultAsync();

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