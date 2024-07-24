using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class ProjectRepository(DataContext context) : IProjectRepository
  {
    private readonly DataContext context = context;

    public ICollection<Project> GetProjects() => context.Projects.ToList();
    public Project GetProject(string projectId) => 
      context.Projects.Where(p => p.ProjectId == projectId).FirstOrDefault() ??
      throw new Exception("No Project with the specified id was found");
    public Project? GetProjectByName(string projectName) => context.GetEntityByName<Project>(projectName);
    public bool CreateProject(Project project) => context.CreateEntity(project);
    public bool UpdateProject(Project project) => context.UpdateEntity(project);
    public bool DeleteProject(Project project) => context.DeleteEntity(project);
    public List<string> GetColumns() => context.GetColumns<Project>();
    public bool ProjectExists(string projectId) => context.Projects.Any(p => p.ProjectId == projectId);
  }
}