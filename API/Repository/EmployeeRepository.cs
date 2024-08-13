using Microsoft.EntityFrameworkCore;
using API.Data;
using API.DTO;
using API.Interfaces;
using API.Models;
using API.Helpers;
using System.Globalization;

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
    public bool CreateEmployee(HashSet<EmployeeProjectRelatedEntities> projects, Employee employee)
    {
      if(employee == null) return false;

      var numberOfEmployeesEntities = GetNumberOfEmployeesEntities(employee);
      if(numberOfEmployeesEntities == null && !numberOfEmployeesEntities.HasValue)
        return false;

      bool addProjectsSuccess = context.AddRelatedEntities(
        employee, projects, context.Projects,
        (e, p, i) => new EmployeeProject
        {
          EmployeeProjectId = Guid.NewGuid().ToString(),
          EmployeeId = e.EmployeeId,
          ProjectId = p.ProjectId,
          AssignedDate = DateTime.ParseExact(i.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture),
          Employee = e,
          Project = p
        },
        employee.EmployeeProjects
        );

      if(!addProjectsSuccess) return false;
      var (company, department) = numberOfEmployeesEntities.Value;
      company.TotalWorkers++;
      department.TotalEmployees++;

      context.Update(company);
      context.Update(department);
      return context.CreateEntity(employee);
    }
    public bool UpdateEmployee(HashSet<EmployeeProjectRelatedEntities> projects, Employee employee)
    {
      if(employee == null) 
        return false;

      bool projectsRemoved = context.RemoveRelatedEntities(
        employee.EmployeeId,
        e => e.EmployeeProjects,
        context.Employees,
        context.EmployeeProjects);

      if(!projectsRemoved) return false;

      bool addProjectsSuccess = context.AddRelatedEntities(
        employee, projects, context.Projects,
        (e, p, i) => new EmployeeProject
        {
          EmployeeProjectId = Guid.NewGuid().ToString(),
          EmployeeId = e.EmployeeId,
          ProjectId = p.ProjectId,
          AssignedDate = DateTime.ParseExact(i.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture),
          Employee = e,
          Project = p
        },
        employee.EmployeeProjects
        );

      return addProjectsSuccess && context.UpdateEntity(employee);
    }
    public bool DeleteEmployee(Employee employee)
    {
      if(employee == null) return false;

      var numberOfEmployeesEntities = GetNumberOfEmployeesEntities(employee);
      if(numberOfEmployeesEntities == null && !numberOfEmployeesEntities.HasValue)
        return false;

      var (company, department) = numberOfEmployeesEntities.Value;
      company.TotalWorkers--;
      department.TotalEmployees--;

      bool projectsRemoved = context.RemoveRelatedEntities(
        employee.EmployeeId,
        e => e.EmployeeProjects,
        context.Employees,
        context.EmployeeProjects);

      if(!projectsRemoved) return false;
      context.Update(company);
      context.Update(department);
      return context.DeleteEntity(employee);
    }
    public void GetColumnsFromRelatedEntity(EmployeeListDTO employee, HashSet<string> columns) => context.GetColumns(employee, columns);
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
  }
}