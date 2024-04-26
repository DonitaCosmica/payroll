using Payroll.Data;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class EmployeeRepository(DataContext context) : IEmployeeRepository
  {
    private readonly DataContext context = context;

    public ICollection<Employee> GetEmployees() => context.Employees.ToList();
    public Employee GetEmployee(string employeeId) => 
      context.Employees.Where(e => e.EmployeeId == employeeId).FirstOrDefault() ??
      throw new Exception("No Employee with the specified id was found");
    public bool CreateEmployee(List<ProjectDTO> projects, Employee employee)
    {
      foreach(var projectDTO in projects)
      {
        var project = context.Projects.Where(p => p.ProjectId == projectDTO.ProjectId).FirstOrDefault();

        if (project == null || employee == null)
          return false;
        
        var employeeProject = new EmployeeProject
        {
          Employee = employee,
          Project = project
        };

        context.Add(employeeProject);
      }

      context.Add(employee);

      return Save();
    }
    public bool UpdateEmployee(Employee employee)
    {
      context.Update(employee);
      return Save();
    }
    public bool DeleteEmployee(Employee employee)
    {
      context.Remove(employee);
      return Save();
    }
    public bool EmployeeExists(string employeeId) => context.Employees.Any(e => e.EmployeeId == employeeId);
    public bool Save() => context.SaveChanges() > 0;
  }
}