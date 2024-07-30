using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class EmployeeProjectsRepository(DataContext context) : IEmployeeProjectsRepository
  {
    private readonly DataContext context = context;

    public ICollection<EmployeeProject> GetProjects(string employeeId) => 
      context.EmployeeProjects.Where(ep => ep.EmployeeId == employeeId).ToList();
  }
}