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
    bool CreateEmployee(HashSet<EmployeeProjectRelatedEntities> projects, Employee employee);
    bool UpdateEmployee(HashSet<EmployeeProjectRelatedEntities> projects, Employee employee);
    bool DeleteEmployee(Employee employee);
    bool EmployeeExists(string employeeId);
    public void GetColumnsFromRelatedEntity(EmployeeListDTO employee, HashSet<string> columns);
    List<string> GetColumns();
  }
}