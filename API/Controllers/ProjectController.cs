using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace API.Controllers
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
      List<ProjectDTO> projects = [.. projectRepository.GetProjects().Select(MapToProjectDTORequest)];
      List<string> columns = projectRepository.GetColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = projects,
        FormData = projects
      };

      return Ok(result);
    }

    [HttpGet("by")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<ProjectDTO>))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetProjects([FromQuery] string companyId) {
      List<ProjectDTO> projects = projectRepository.GetProjectsByCompany(companyId).Select(MapToProjectDTORequest).ToList();
      List<string> columns = projectRepository.GetColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = projects,
        FormData = projects
      };

      return Ok(result);
    }

    [HttpGet("{projectId}")]
    [ProducesResponseType(200, Type = typeof(ProjectDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetProject(string projectId)
    {
      if(!projectRepository.ProjectExists(projectId))
        return NotFound();

      ProjectDTO project = MapToProjectDTORequest(projectRepository.GetProject(projectId));
      return Ok(project);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateProject([FromBody] ProjectDTO projectCreate)
    {
      if(projectCreate == null || string.IsNullOrEmpty(projectCreate.Code) || string.IsNullOrEmpty(projectCreate.Name))
        return BadRequest();

      if(projectRepository.GetProjectByName(projectCreate) != null)
        return Conflict("Project already exists");

      var relatedEntities = projectRepository.GetRelatedEntities(projectCreate);
      if(relatedEntities == null  && !relatedEntities.HasValue)
        return StatusCode(500, "Something went wrong while fetching related data");
      
      var (company, status) = relatedEntities.Value;
      Project project = new()
      {
        ProjectId = Guid.NewGuid().ToString(),
        Code = projectCreate.Code,
        Name = projectCreate.Name,
        StartDate = DateTime.ParseExact(
          projectCreate.StartDate ?? DateTime.Now.ToString("yyyy-MM-dd"),
          "yyyy-MM-dd",
          CultureInfo.InvariantCulture
        ),
        StatusId = status.StatusId,
        Status = status,
        CompanyId = projectCreate.Company,
        Company = company,
        Description = projectCreate.Description ?? projectCreate.Name
      };

      if(!projectRepository.CreateProject(project))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPost("csv")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult UpdateProjects([FromBody] IEnumerable<ProjectDTO> projects)
    {
      if(projects == null || !projects.Any())
        return BadRequest(new { success = false, message = "No projects provided." });

      foreach(ProjectDTO project in projects)
      {
        if(project == null || string.IsNullOrEmpty(project.Code) || string.IsNullOrEmpty(project.Name))
          return BadRequest(new { success = false, message = "Invalid data for one or more projects." });

        Project? existingProject = projectRepository.GetProjectByName(project);
        var relatedEntities = projectRepository.GetRelatedEntities(project);
        if(relatedEntities == null  && !relatedEntities.HasValue)
          return StatusCode(500, "Something went wrong while fetching related data");
          
        var (company, status) = relatedEntities.Value;
        if(existingProject == null)
        {
          Project newProject = new()
          {
            ProjectId = Guid.NewGuid().ToString(),
            Code = project.Code,
            Name = project.Name,
            StartDate = DateTime.ParseExact(
              project.StartDate ?? DateTime.Now.ToString("yyyy-MM-dd"),
              "yyyy-MM-dd",
              CultureInfo.InvariantCulture
            ),
            StatusId = status.StatusId,
            Status = status,
            CompanyId = project.Company,
            Company = company,
            Description = project.Description ?? project.Name
          };

          if(!projectRepository.CreateProject(newProject))
            return StatusCode(500, "Something went wrong while saving");
        }
        else
        {
          existingProject.Code = project.Code;
          existingProject.Name = project.Name;
          existingProject.StartDate = DateTime.ParseExact(
            project.StartDate ?? DateTime.Now.ToString("yyyy-MM-dd"),
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture
          );
          existingProject.StatusId = status.StatusId;
          existingProject.Status = status;
          existingProject.CompanyId = project.Company;
          existingProject.Company = company;
          existingProject.Description = project.Description ?? project.Name;

          if(!projectRepository.UpdateProject(existingProject))
            return StatusCode(500, "Something went wrong updating Project");
        }
      }

      return Ok(new { success = true, message = "Projects processed successfully." });
    }

    [HttpPatch("{projectId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateProject(string projectId, [FromBody] ProjectDTO projectUpdate)
    {
      if(projectUpdate == null || string.IsNullOrEmpty(projectUpdate.Code) || string.IsNullOrEmpty(projectUpdate.Name) || string.IsNullOrEmpty(projectUpdate.Description))
        return BadRequest();

      Project project = projectRepository.GetProject(projectId);
      if (project == null)
        return NotFound("Project not found");

      var relatedEntities = projectRepository.GetRelatedEntities(projectUpdate);
      if(relatedEntities == null && !relatedEntities.HasValue)
        return StatusCode(500, "Something went wrong while fetching related data");

      var (company, status) = relatedEntities.Value;
      project.Code = projectUpdate.Code;
      project.Name = projectUpdate.Name;
      project.StartDate = DateTime.ParseExact(
        projectUpdate.StartDate ?? DateTime.Now.ToString("yyyy-MM-dd"),
        "yyyy-MM-dd",
        CultureInfo.InvariantCulture
      );
      project.StatusId = status.StatusId;
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

      if(!projectRepository.DeleteProject(projectRepository.GetProject(projectId)))
        return StatusCode(500, "sOmething went wrong while deleting Project");

      return NoContent();
    }

    private ProjectDTO MapToProjectDTORequest(Project? project)
    {
      if(project == null) return new ProjectDTO();
        
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