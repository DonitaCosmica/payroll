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
      (from b in context.Banks.Where(b => b.BankId == employeeDTO.Bank).DefaultIfEmpty()
        from c in context.Companies.Where(c => c.CompanyId == employeeDTO.Company).DefaultIfEmpty()
        from ca in context.CommercialAreas.Where(ca => ca.CommercialAreaId == employeeDTO.CommercialArea).DefaultIfEmpty()
        from ct in context.Contracts.Where(ct => ct.ContractId == employeeDTO.Contract).DefaultIfEmpty()
        from fe in context.FederalEntities.Where(fe => fe.FederalEntityId == employeeDTO.FederalEntity).DefaultIfEmpty()
        from jp in context.JobPositions.Where(jp => jp.JobPositionId == employeeDTO.JobPosition).DefaultIfEmpty()
        from r in context.Regimes.Where(r => r.RegimeId == employeeDTO.Regime).DefaultIfEmpty()
        from s in context.Statuses.Where(s => s.StatusId == employeeDTO.Status).DefaultIfEmpty()
        from st in context.States.Where(st => st.StateId == employeeDTO.State).DefaultIfEmpty()
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
        }).FirstOrDefault() ?? new EmployeeRelatedEntities();
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
    public void GetColumnsFromRelatedEntity(EmployeeListDTO employee, List<string> columns) => context.GetColumns(employee, columns);
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