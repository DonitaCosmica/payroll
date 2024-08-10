using API.DTO;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
  public interface IEmployeeRepository
  {
    ICollection<Employee> GetEmployees();
    Employee GetEmployee(string employeeId);
    public EmployeeRelatedEntities? GetRelatedEntities(EmployeeDTO employeeDTO);
    bool CreateEmployee(List<string> projects, Employee employee);
    bool UpdateEmployee(List<string> projects, Employee employee);
    bool DeleteEmployee(Employee employee);
    bool EmployeeExists(string employeeId);
    List<string> GetColumns();
  }
}