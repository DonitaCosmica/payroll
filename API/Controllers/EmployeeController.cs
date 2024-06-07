using Microsoft.AspNetCore.Mvc;
using Payroll.Data;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeeController( DataContext context, IEmployeeRepository employeeRepository) : Controller
  {
    private readonly DataContext context = context;
    private readonly IEmployeeRepository employeeRepository = employeeRepository;

    private EmployeeDTO MapToEmployeeDTORequest(Employee? employee)
    {
      if (employee == null)
        return new EmployeeDTO();

      var employeeDTO = new EmployeeDTO();

      var query = from e in context.Employees
        join b in context.Banks on e.BankId equals b.BankId
        join c in context.Companies on e.CompanyId equals c.CompanyId
        join ca in context.CommercialAreas on e.CommercialAreaId equals ca.CommercialAreaId
        join ct in context.Contracts on e.ContractId equals ct.ContractId
        join fe in context.FederalEntities on e.FederalEntityId equals fe.FederalEntityId
        join jp in context.JobPositions on e.JobPositionId equals jp.JobPositionId
        join r in context.Regimes on e.RegimeId equals r.RegimeId
        join s in context.Statuses on e.StatusId equals s.StatusId
        join st in context.States on e.StateId equals st.StateId
        where e.EmployeeId == employee.EmployeeId
        select new
        {
          Employee = e,
          BankName = b.Name,
          CompanyName = c.Name,
          CommercialAreaName = ca.Name,
          ContractName = ct.Name,
          FederalEntityName = fe.Name,
          JobPositionName = jp.Name,
          RegimeName = r.Name,
          StatusName = s.Name,
          StateName = st.Name,
          Projects = (from ep in context.EmployeeProjects
            where ep.EmployeeId == e.EmployeeId
            from p in context.Projects
            where p.ProjectId == ep.ProjectId
            select p.Name).ToList()
        };

        var result = query.FirstOrDefault();
        if(result != null)
        {
          employeeDTO.EmployeeId = result.Employee.EmployeeId;
          employeeDTO.Key = result.Employee.Key;
          employeeDTO.Name = result.Employee.Name;
          employeeDTO.RFC = result.Employee.RFC;
          employeeDTO.CURP = result.Employee.CURP;
          employeeDTO.Company = result.CompanyName;
          employeeDTO.Bank = result.BankName;
          employeeDTO.InterbankCode = result.Employee.InterbankCode;
          employeeDTO.BankAccocunt =  result.Employee.BankAccocunt;
          employeeDTO.BankPortalID = result.Employee.BankPortalID;
          employeeDTO.IsAStarter = result.Employee.IsAStarter;
          employeeDTO.Regime = result.RegimeName;
          employeeDTO.NSS = result.Employee.NSS;
          employeeDTO.DateAdmission = result.Employee.DateAdmission;
          employeeDTO.JobPosition = result.JobPositionName;
          employeeDTO.CommercialArea = result.CommercialAreaName;
          employeeDTO.Contract = result.ContractName;
          employeeDTO.BaseSalary = result.Employee.BaseSalary;
          employeeDTO.DailySalary = result.Employee.DailySalary;
          employeeDTO.ValuePerExtraHour = result.Employee.ValuePerExtraHour;
          employeeDTO.FederalEntity = result.FederalEntityName;
          employeeDTO.Phone = result.Employee.Phone;
          employeeDTO.Email = result.Employee.Email;
          employeeDTO.Direction = result.Employee.Direction;
          employeeDTO.Suburb = result.Employee.Suburb;
          employeeDTO.PostalCode = result.Employee.PostalCode;
          employeeDTO.City = result.Employee.City;
          employeeDTO.State = result.StateName;
          employeeDTO.Country = result.Employee.Country;
          employeeDTO.Status = result.StatusName;
          employeeDTO.IsProvider = result.Employee.IsProvider;
          employeeDTO.Credit = result.Employee.Credit;
          employeeDTO.Contact = result.Employee.Contact;
          employeeDTO.Projects = result.Projects;
        }

      return employeeDTO;
    }

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<Employee>))]
    public IActionResult GetEmployees()
    {
      var employees = employeeRepository.GetEmployees()
        .Select(MapToEmployeeDTORequest).ToList();

      var result = new
      {
        Columns = employeeRepository.GetColumns(),
        Employees = employees
      };

      result.Columns.Insert(8, "Projects");
      return Ok(result);
    }

    [HttpGet("{employeeId}")]
    [ProducesResponseType(200, Type = typeof(EmployeeDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetEmployee(string employeeId)
    {
      if(!employeeRepository.EmployeeExists(employeeId))
        return NotFound();

      var employee = employeeRepository.GetEmployee(employeeId);
      var employeeDTO = MapToEmployeeDTORequest(employee);
      var result = new
      {
        Columns = employeeRepository.GetColumns(),
        Employee = employeeDTO
      };

      result.Columns.Insert(8, "Projects");
      return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateEmployee([FromBody] EmployeeDTO employeeCreate)
    {
      if(employeeCreate == null)
        return BadRequest();

      var query = from c in context.Companies
        join b in context.Banks on employeeCreate.Bank equals b.BankId
        join ca in context.CommercialAreas on employeeCreate.CommercialArea equals ca.CommercialAreaId
        join ct in context.Contracts on employeeCreate.Contract equals ct.ContractId
        join fe in context.FederalEntities on employeeCreate.FederalEntity equals fe.FederalEntityId
        join jp in context.JobPositions on employeeCreate.JobPosition equals jp.JobPositionId
        join r in context.Regimes on employeeCreate.Regime equals r.RegimeId
        join s in context.Statuses on employeeCreate.Status equals s.StatusId
        join st in context.States on employeeCreate.State equals st.StateId
        select new
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
        };

      var result = query.FirstOrDefault();
      if(result == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      var employee = new Employee
      {
        EmployeeId = Guid.NewGuid().ToString(),
        Key = employeeCreate.Key,
        Name = employeeCreate.Name,
        RFC = employeeCreate.RFC,
        CURP = employeeCreate.CURP,
        BankId = employeeCreate.Bank,
        Bank = result.Bank,
        InterbankCode = employeeCreate.InterbankCode,
        BankAccocunt = employeeCreate.BankAccocunt,
        BankPortalID = employeeCreate.BankPortalID,
        IsAStarter = employeeCreate.IsAStarter,
        RegimeId = employeeCreate.Regime,
        Regime = result.Regime,
        NSS = employeeCreate.NSS,
        DateAdmission = employeeCreate.DateAdmission,
        JobPositionId = employeeCreate.JobPosition,
        JobPosition = result.JobPosition,
        CommercialAreaId = employeeCreate.CommercialArea,
        CommercialArea = result.CommercialArea,
        ContractId = employeeCreate.Contract,
        Contract = result.Contract,
        BaseSalary = employeeCreate.BaseSalary,
        DailySalary = employeeCreate.DailySalary,
        ValuePerExtraHour = employeeCreate.ValuePerExtraHour,
        FederalEntityId = employeeCreate.FederalEntity,
        FederalEntity = result.FederalEntity,
        Phone = employeeCreate.Phone,
        Email = employeeCreate.Email,
        Direction = employeeCreate.Direction,
        Suburb = employeeCreate.Suburb,
        PostalCode = employeeCreate.PostalCode,
        City = employeeCreate.City,
        StateId = employeeCreate.State,
        State = result.State,
        Country = employeeCreate.Country,
        StatusId = employeeCreate.Status,
        Status = result.Status,
        IsProvider = employeeCreate.IsProvider,
        Credit = employeeCreate.Credit,
        Contact = employeeCreate.Contact,
        CompanyId = employeeCreate.Company,
        Company = result.Company,
      };

      if(!employeeRepository.CreateEmployee(employeeCreate.Projects, employee))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpDelete("{employeeId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteEmployee(string employeeId)
    {
      if(!employeeRepository.EmployeeExists(employeeId))
        return NotFound();

      var employeeToDelete = employeeRepository.GetEmployee(employeeId);

      if(!employeeRepository.DeleteEmployee(employeeToDelete))
        return StatusCode(500, "Something went wrong deleting employee");

      return NoContent();
    }
  }
}