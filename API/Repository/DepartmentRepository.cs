using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class DepartmentRepository(DataContext context) : IDepartmentRepository
  {
    private readonly DataContext context = context;

    public ICollection<Department> GetDepartments() => context.Departments.ToList();
    public Department GetDepartment(string departmentId) => 
      context.Departments.Where(d => d.DepartmentId == departmentId).FirstOrDefault() ??
      throw new Exception("No Department with the specified id was found");
    public bool CreateDepartment(Department department) => context.CreateEntity(department);
    public bool UpdateDepartment(Department department) => context.UpdateEntity(department);
    public bool DeleteDepartment(Department department) => context.DeleteEntity(department);
    public List<string> GetColumns() => context.GetColumns<Department>();
    public bool DepartmentExists(string departmentId) => context.Departments.Any(d => d.DepartmentId == departmentId);
  }
}