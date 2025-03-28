using API.DTO;
using API.Models;

namespace API.Interfaces
{
  public interface IProjectRepository
  {
    ICollection<Project> GetProjects();
    ICollection<Project> GetProjectsByCompany(string companyId);
    Project GetProject(string projectId);
    Project? GetProjectByName(ProjectDTO project);
    (Company, Status)? GetRelatedEntities(ProjectDTO projectDTO);
    bool CreateProject(Project project);
    bool UpdateProject(Project project);
    bool DeleteProject(Project project);
    List<string> GetColumns();
    bool ProjectExists(string projectId);
  }
}