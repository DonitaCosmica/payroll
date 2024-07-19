using Microsoft.EntityFrameworkCore;
using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class ProjectRepository(DataContext context) : IProjectRepository
  {
    private readonly DataContext context = context;

    public async Task<ICollection<Project>> GetProjects() => await context.Projects.ToListAsync();
    public async Task<Project> GetProject(string projectId) => 
      await context.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId) ??
      throw new Exception("No Project with the specified id was found");
    public async Task<bool> CreateProject(Project project) => await context.CreateEntity(project);
    public async Task<bool> UpdateProject(Project project) => await context.UpdateEntity(project);
    public async Task<bool> DeleteProject(Project project) => await context.DeleteEntity(project);
    public async Task<List<string>> GetColumns() => await context.GetColumns<Project>();
    public async Task<bool> ProjectExistsAsync(string projectId) => await context.Projects.AnyAsync(p => p.ProjectId == projectId);
  }
}