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
    public bool CreateProject(Project project)
    {
      context.Add(project);
      return Save();
    }
    public bool UpdateProject(Project project)
    {
      context.Update(project);
      return Save();
    }
    public bool DeleteProject(Project project)
    {
      context.Remove(project);
      return Save();
    }
    public bool ProjectExists(string projectId) => context.Projects.Any(p => p.ProjectId == projectId);
    public bool Save() => context.SaveChanges() > 0;
  }
}