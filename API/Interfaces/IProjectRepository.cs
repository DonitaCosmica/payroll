using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IProjectRepository
  {
    ICollection<Project> GetProjects();
    Project GetProject(string projectId);
    bool CreateProject(Project project);
    bool UpdateProject(Project project);
    bool DeleteProject(Project project);
    List<string> GetColumns();
    bool ProjectExists(string projectId);
  }
}