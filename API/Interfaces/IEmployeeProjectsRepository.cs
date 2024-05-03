using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IEmployeeProjectsRepository
  {
    ICollection<EmployeeProject> GetProjects(string employeeId);
  }
}