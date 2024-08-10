using Microsoft.EntityFrameworkCore;
using API.Data;
using API.DTO;
using API.Interfaces;
using API.Models;
using API.Helpers;

namespace API.Repository
{
  public class EmployeeRepository(DataContext context) : IEmployeeRepository
  {
    private readonly DataContext context = context;

    public ICollection<Employee> GetEmployees() =>
      IncludeRelatedEntities(context.Employees).ToList();
    public Employee GetEmployee(string employeeId) =>
      IncludeRelatedEntities(context.Employees).FirstOrDefault(e => e.EmployeeId == employeeId)
      ?? throw new Exception("No Employee with the specified id was found");
    public EmployeeRelatedEntities? GetRelatedEntities(EmployeeDTO employeeDTO) =>
      (from c in context.Companies
        join b in context.Banks on employeeDTO.Bank equals b.BankId
        join ca in context.CommercialAreas on employeeDTO.CommercialArea equals ca.CommercialAreaId
        join ct in context.Contracts on employeeDTO.Contract equals ct.ContractId
        join fe in context.FederalEntities on employeeDTO.FederalEntity equals fe.FederalEntityId
        join jp in context.JobPositions on employeeDTO.JobPosition equals jp.JobPositionId
        join r in context.Regimes on employeeDTO.Regime equals r.RegimeId
        join s in context.Statuses on employeeDTO.Status equals s.StatusId
        join st in context.States on employeeDTO.State equals st.StateId
        where employeeDTO.Company == c.CompanyId &&
          b.BankId == employeeDTO.Bank &&
          ca.CommercialAreaId == employeeDTO.CommercialArea &&
          ct.ContractId == employeeDTO.Contract &&
          fe.FederalEntityId == employeeDTO.FederalEntity &&
          jp.JobPositionId == employeeDTO.JobPosition &&
          r.RegimeId == employeeDTO.Regime &&
          s.StatusId == employeeDTO.Status &&
          st.StateId == employeeDTO.State
        select new EmployeeRelatedEntities
        {
          Bank = b,
          Company = c,
          CommercialArea = ca,
          Contract = ct,
          FederalEntity = fe,
          JobPosition = jp,
          Regime = r,
          Status = s,
          State = st
        }).FirstOrDefault();
    public bool CreateEmployee(List<string> projects, Employee employee)
    {
      if(employee == null) return false;

      var numberOfEmployeesEntities = GetNumberOfEmployeesEntities(employee);
      if(numberOfEmployeesEntities == null && !numberOfEmployeesEntities.HasValue)
        return false;

      if(!AddProjectsToEmployee(employee, projects))
        return false;

      var (company, department) = numberOfEmployeesEntities.Value;
      company.TotalWorkers++;
      department.TotalEmployees++;

      context.Add(employee);
      context.Update(company);
      context.Update(department);
      return Save();
    }
    public bool UpdateEmployee(List<string> projects, Employee employee)
    {
      if(employee == null || !RemoveEmployeeProjects(employee.EmployeeId)) 
        return false;

      if(!AddProjectsToEmployee(employee, projects))
        return false;

      context.Update(employee);
      return Save();
    }
    public bool DeleteEmployee(Employee employee)
    {
      var numberOfEmployeesEntities = GetNumberOfEmployeesEntities(employee);
      if(numberOfEmployeesEntities == null && !numberOfEmployeesEntities.HasValue)
        return false;

      var (company, department) = numberOfEmployeesEntities.Value;
      company.TotalWorkers--;
      department.TotalEmployees--;

      context.Update(company);
      context.Update(department);
      context.Remove(employee);
      return RemoveEmployeeProjects(employee.EmployeeId);
    }
    public List<string> GetColumns() => context.GetColumns<Employee>();
    public bool EmployeeExists(string employeeId) => context.Employees.Any(e => e.EmployeeId == employeeId);
    private (Company, Department)? GetNumberOfEmployeesEntities(Employee employee)
    {
      var result = (from c in context.Companies
        join jp in context.JobPositions on employee.JobPositionId equals jp.JobPositionId
        join d in context.Departments on jp.DepartmentId equals d.DepartmentId
        where jp.JobPositionId == employee.JobPositionId && c.CompanyId == employee.CompanyId
        select new { c, d })
        .FirstOrDefault();

      if(result == null) return null;
      return (result.c, result.d);
    }
    private static IQueryable<Employee> IncludeRelatedEntities(IQueryable<Employee> query) =>
      query
        .Include(e => e.Bank).Include(e => e.Company).Include(e => e.CommercialArea)
        .Include(e => e.Contract).Include(e => e.FederalEntity)
        .Include(e => e.JobPosition).ThenInclude(jp => jp.Department)
        .Include(e => e.Regime).Include(e => e.Status).Include(e => e.State)
        .Include(e => e.EmployeeProjects).ThenInclude(ep => ep.Project);
    private bool AddProjectsToEmployee(Employee employee, List<string> projects)
    {
      foreach(var projectId in projects)
      {
        var project = context.Projects.FirstOrDefault(p => p.ProjectId == projectId);
        if (project == null) return false;
        
        var employeeProject = new EmployeeProject
        {
          EmployeeProjectId = Guid.NewGuid().ToString(),
          EmployeeId = employee.EmployeeId,
          ProjectId = project.ProjectId,
          AssignedDate = employee.DateAdmission,
          Employee = employee,
          Project = project
        };

        employee.EmployeeProjects.Add(employeeProject);
        context.Add(employeeProject);
      }

      return true;
    }
    private bool RemoveEmployeeProjects(string employeeId)
    {
      var employee = context.Employees
        .Include(e => e.EmployeeProjects)
        .FirstOrDefault(e => e.EmployeeId == employeeId);

      if(employee == null) return false;
      context.EmployeeProjects.RemoveRange(employee.EmployeeProjects);
      return Save();
    }
    private bool Save() => context.SaveChanges() > 0;
  }
}