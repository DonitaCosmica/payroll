using ERPAPI.Data;
using ERPAPI.Interfaces;
using ERPAPI.Models;

namespace ERPAPI.Repository;

public class ProjectRepository(DataContext context) : IProjectRepository
{
  private readonly DataContext context = context;
  public ICollection<Project> GetProjects() => [.. context.Projects];
}