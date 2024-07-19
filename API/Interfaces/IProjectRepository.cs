using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IProjectRepository
  {
    Task<ICollection<Project>> GetProjects();
    Task<Project> GetProject(string projectId);
    Task<bool> CreateProject(Project project);
    Task<bool> UpdateProject(Project project);
    Task<bool> DeleteProject(Project project);
    Task<List<string>> GetColumns();
    Task<bool> ProjectExistsAsync(string projectId);
  }
}