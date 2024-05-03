using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class EmployeeProjectsRepository(DataContext context) : IEmployeeProjectsRepository
  {
    private readonly DataContext context = context;

    public ICollection<EmployeeProject> GetProjects(string employeeId) => 
      context.EmployeeProjects.Where(ep => ep.EmployeeId == employeeId).ToList();
  }
}