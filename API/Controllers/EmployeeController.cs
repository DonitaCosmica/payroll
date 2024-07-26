using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeeController(IEmployeeRepository employeeRepository) : Controller
  {
    private readonly IEmployeeRepository employeeRepository = employeeRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<Employee>))]
    public IActionResult GetEmployees()
    {
      var employees = employeeRepository.GetEmployees()
        .Select(MapToEmployeeDTORequest).ToList();

      var result = new
      {
        Columns = GetEmployeeColumns(),
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
        Columns = GetEmployeeColumns(),
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

      var relatedEntities = employeeRepository.GetRelatedEntities(employeeCreate);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      var employee = MapToEmployeeModel(employeeCreate, relatedEntities);
      if(!employeeRepository.CreateEmployee(employeeCreate.Projects, employee))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{employeeId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateEmployee(string employeeId, [FromBody] EmployeeDTO updateEmployee)
    {
      if(updateEmployee == null)
        return BadRequest();

      var employee = employeeRepository.GetEmployee(employeeId);
      if(employee == null)
        return NotFound();

      var relatedEntities = employeeRepository.GetRelatedEntities(updateEmployee);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");

            MapToUpdateEmployeeModel(employee, updateEmployee, relatedEntities);
      if(!employeeRepository.UpdateEmployee(employee))
        return StatusCode(500, "Something went wrong updating Employee");

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

    private List<string> GetEmployeeColumns()
    {
      var columns = employeeRepository.GetColumns();
      columns.Insert(8, "Projects");
      return columns;
    }

    private static Employee MapToEmployeeModel(EmployeeDTO employeeCreate, EmployeeRelatedEntitiesDTO relatedEntities)
    {
      return new Employee
      {
        EmployeeId = Guid.NewGuid().ToString(),
        Key = employeeCreate.Key,
        Name = employeeCreate.Name,
        RFC = employeeCreate.RFC,
        CURP = employeeCreate.CURP,
        BankId = employeeCreate.Bank,
        Bank = relatedEntities.Bank,
        InterbankCode = employeeCreate.InterbankCode,
        BankAccount = employeeCreate.BankAccount,
        BankPortalID = employeeCreate.BankPortalID,
        IsAStarter = employeeCreate.IsAStarter,
        RegimeId = employeeCreate.Regime,
        Regime = relatedEntities.Regime,
        NSS = employeeCreate.NSS,
        DateAdmission = employeeCreate.DateAdmission,
        JobPositionId = employeeCreate.JobPosition,
        JobPosition = relatedEntities.JobPosition,
        CommercialAreaId = employeeCreate.CommercialArea,
        CommercialArea = relatedEntities.CommercialArea,
        ContractId = employeeCreate.Contract,
        Contract = relatedEntities.Contract,
        BaseSalary = employeeCreate.BaseSalary,
        DailySalary = employeeCreate.DailySalary,
        ValuePerExtraHour = employeeCreate.ValuePerExtraHour,
        FederalEntityId = employeeCreate.FederalEntity,
        FederalEntity = relatedEntities.FederalEntity,
        Phone = employeeCreate.Phone,
        Email = employeeCreate.Email,
        Direction = employeeCreate.Direction,
        Suburb = employeeCreate.Suburb,
        PostalCode = employeeCreate.PostalCode,
        City = employeeCreate.City,
        StateId = employeeCreate.State,
        State = relatedEntities.State,
        Country = employeeCreate.Country,
        StatusId = employeeCreate.Status,
        Status = relatedEntities.Status,
        IsProvider = employeeCreate.IsProvider,
        Credit = employeeCreate.Credit,
        Contact = employeeCreate.Contact,
        CompanyId = employeeCreate.Company,
        Company = relatedEntities.Company
      };
    }

    private static void MapToUpdateEmployeeModel(Employee employee, EmployeeDTO updateEmployee, EmployeeRelatedEntitiesDTO relatedEntities)
    {
      employee.Key = updateEmployee.Key;
      employee.Name = updateEmployee.Name;
      employee.RFC = updateEmployee.RFC;
      employee.CURP = updateEmployee.CURP;
      employee.BankId = updateEmployee.Bank;
      employee.Bank = relatedEntities.Bank;
      employee.InterbankCode = updateEmployee.InterbankCode;
      employee.BankAccount = updateEmployee.BankAccount;
      employee.BankPortalID = updateEmployee.BankPortalID;
      employee.IsAStarter = updateEmployee.IsAStarter;
      employee.RegimeId = updateEmployee.Regime;
      employee.Regime = relatedEntities.Regime;
      employee.NSS = updateEmployee.NSS;
      employee.DateAdmission = updateEmployee.DateAdmission;
      employee.JobPositionId = updateEmployee.JobPosition;
      employee.JobPosition = relatedEntities.JobPosition;
      employee.CommercialAreaId = updateEmployee.CommercialArea;
      employee.CommercialArea = relatedEntities.CommercialArea;
      employee.ContractId = updateEmployee.Contract;
      employee.Contract = relatedEntities.Contract;
      employee.BaseSalary = updateEmployee.BaseSalary;
      employee.DailySalary = updateEmployee.DailySalary;
      employee.ValuePerExtraHour = updateEmployee.ValuePerExtraHour;
      employee.FederalEntityId = updateEmployee.FederalEntity;
      employee.FederalEntity = relatedEntities.FederalEntity;
      employee.Phone = updateEmployee.Phone;
      employee.Email = updateEmployee.Email;
      employee.Direction = updateEmployee.Direction;
      employee.Suburb = updateEmployee.Suburb;
      employee.PostalCode = updateEmployee.PostalCode;
      employee.City = updateEmployee.City;
      employee.StateId = updateEmployee.State;
      employee.State = relatedEntities.State;
      employee.Country = updateEmployee.Country;
      employee.StatusId = updateEmployee.Status;
      employee.Status = relatedEntities.Status;
      employee.IsProvider = updateEmployee.IsProvider;
      employee.Credit = updateEmployee.Credit;
      employee.Contact = updateEmployee.Contact;
      employee.CompanyId = updateEmployee.Company;
      employee.Company = relatedEntities.Company;
    }

    private EmployeeDTO MapToEmployeeDTORequest(Employee? employee)
    {
      if (employee == null)
        return new EmployeeDTO();

      return new EmployeeDTO()
      {
        EmployeeId = employee.EmployeeId,
        Key = employee.Key,
        Name = employee.Name,
        RFC = employee.RFC,
        CURP = employee.CURP,
        Company = employee.Company.Name,
        Bank = employee.Bank.Name,
        InterbankCode = employee.InterbankCode,
        BankAccount =  employee.BankAccount,
        BankPortalID = employee.BankPortalID,
        IsAStarter = employee.IsAStarter,
        Regime = employee.Regime.Name,
        NSS = employee.NSS,
        DateAdmission = employee.DateAdmission,
        JobPosition = employee.JobPosition.Name,
        CommercialArea = employee.CommercialArea.Name,
        Contract = employee.Contract.Name,
        BaseSalary = employee.BaseSalary,
        DailySalary = employee.DailySalary,
        ValuePerExtraHour = employee.ValuePerExtraHour,
        FederalEntity = employee.FederalEntity.Name,
        Phone = employee.Phone,
        Email = employee.Email,
        Direction = employee.Direction,
        Suburb = employee.Suburb,
        PostalCode = employee.PostalCode,
        City = employee.City,
        State = employee.State.Name,
        Country = employee.Country,
        Status = employee.Status.Name,
        IsProvider = employee.IsProvider,
        Credit = employee.Credit,
        Contact = employee.Contact,
        Projects = employee.EmployeeProjects
          .Select(ep => ep.Project.Name).ToList()
      };
    }
  }
}