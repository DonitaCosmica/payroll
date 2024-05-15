using Payroll.DTO;
using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IEmployeeRepository
  {
    ICollection<Employee> GetEmployees();
    Employee GetEmployee(string employeeId);
    bool CreateEmployee(List<string> projects, Employee employee);
    bool UpdateEmployee(Employee employee);
    bool DeleteEmployee(Employee employee);
    bool EmployeeExists(string employeeId);
    List<string> GetColumns();
    bool Save();
  }
}