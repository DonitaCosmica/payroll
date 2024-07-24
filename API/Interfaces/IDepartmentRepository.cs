using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IDepartmentRepository
  {
    ICollection<Department> GetDepartments();
    Department GetDepartment(string departmentId);
    Department? GetDepartmentByName(string departmentName);
    bool CreateDepartment(Department department);
    bool UpdateDepartment(Department department);
    bool DeleteDepartment(Department department);
    List<string> GetColumns();
    bool DepartmentExists(string departmentId);
  }
}