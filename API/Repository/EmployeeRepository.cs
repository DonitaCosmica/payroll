using Microsoft.EntityFrameworkCore;
using API.Data;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class EmployeeRepository(DataContext context) : IEmployeeRepository
  {
    private readonly DataContext context = context;

    public ICollection<Employee> GetEmployees() => 
      context.Employees
      .Include(e => e.Bank).Include(e => e.Company).Include(e => e.CommercialArea)
      .Include(e => e.Contract).Include(e => e.FederalEntity).Include(e => e.JobPosition)
      .Include(e => e.Regime).Include(e => e.Status).Include(e => e.State)
      .Include(e => e.EmployeeProjects).ThenInclude(ep => ep.Project)
      .ToList();
    public Employee GetEmployee(string employeeId) => 
      context.Employees
      .Include(e => e.Bank).Include(e => e.Company).Include(e => e.CommercialArea)
      .Include(e => e.Contract).Include(e => e.FederalEntity).Include(e => e.JobPosition)
      .Include(e => e.Regime).Include(e => e.Status).Include(e => e.State)
      .Include(e => e.EmployeeProjects).ThenInclude(ep => ep.Project)
      .FirstOrDefault(e => e.EmployeeId == employeeId) ??
      throw new Exception("No Employee with the specified id was found");
    public EmployeeRelatedEntitiesDTO? GetRelatedEntities(EmployeeDTO employeeDTO)
    {
      var result = (from c in context.Companies
        join b in context.Banks on employeeDTO.Bank equals b.BankId
        join ca in context.CommercialAreas on employeeDTO.CommercialArea equals ca.CommercialAreaId
        join ct in context.Contracts on employeeDTO.Contract equals ct.ContractId
        join fe in context.FederalEntities on employeeDTO.FederalEntity equals fe.FederalEntityId
        join jp in context.JobPositions on employeeDTO.JobPosition equals jp.JobPositionId
        join r in context.Regimes on employeeDTO.Regime equals r.RegimeId
        join s in context.Statuses on employeeDTO.Status equals s.StatusId
        join st in context.States on employeeDTO.State equals st.StateId
        select new EmployeeRelatedEntitiesDTO
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

      return result;
    }
    public bool CreateEmployee(List<string> projects, Employee employee)
    {
      if(employee == null) return false;

      foreach(var projectId in projects)
      {
        var project = context.Projects.FirstOrDefault(p => p.ProjectId == projectId);
        if (project == null) return false;
        
        var employeeProject = new EmployeeProject
        {
          EmployeeProjectId = Guid.NewGuid().ToString(),
          EmployeeId = employee.EmployeeId,
          ProjectId = project.ProjectId,
          Employee = employee,
          Project = project
        };

        employee.EmployeeProjects.Add(employeeProject);
        context.Add(employeeProject);
      }

      context.Add(employee);
      return Save();
    }
    public bool UpdateEmployee(Employee employee) => context.UpdateEntity(employee);
    public bool DeleteEmployee(Employee employee) => context.DeleteEntity(employee);
    public List<string> GetColumns() => context.GetColumns<Employee>();
    public bool EmployeeExists(string employeeId) => context.Employees.Any(e => e.EmployeeId == employeeId);
    public bool Save() => context.SaveChanges() > 0;
  }
}