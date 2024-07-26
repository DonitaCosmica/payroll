using Microsoft.EntityFrameworkCore;
using Payroll.Data;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class ProjectRepository(DataContext context) : IProjectRepository
  {
    private readonly DataContext context = context;

    public ICollection<Project> GetProjects() => 
      context.Projects.Include(p => p.Company).Include(p => p.Status).ToList();
    public Project GetProject(string projectId) => 
      context.Projects.Include(p => p.Company).Include(p => p.Status)
      .FirstOrDefault(p => p.ProjectId == projectId) ??
      throw new Exception("No Project with the specified id was found");
    public Project? GetProjectByName(string projectName) => context.GetEntityByName<Project>(projectName);
    public (Company, Status)? GetRelatedEntities(ProjectDTO projectDTO)
    {
      var result = (from c in context.Companies
        join s in context.Statuses on projectDTO.Status equals s.StatusId
        where c.CompanyId == projectDTO.Company
        select new { Company = c, Status = s })
        .FirstOrDefault();

      if(result == null) return null;
      return (result.Company, result.Status);
    }
    public bool CreateProject(Project project) => context.CreateEntity(project);
    public bool UpdateProject(Project project) => context.UpdateEntity(project);
    public bool DeleteProject(Project project) => context.DeleteEntity(project);
    public List<string> GetColumns() => context.GetColumns<Project>();
    public bool ProjectExists(string projectId) => context.Projects.Any(p => p.ProjectId == projectId);
  }
}