using API.Models;

namespace API.Interfaces
{
  public interface IEmployeeProjectsRepository
  {
    ICollection<EmployeeProject> GetProjects(string employeeId);
  }
}