using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;
using API.Helpers;
using System.Globalization;
using System.Reflection;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeeController(IEmployeeRepository employeeRepository, IStatusRepository statusRepository) : Controller
  {
    private readonly IEmployeeRepository employeeRepository = employeeRepository;
    private readonly IStatusRepository statusRepository = statusRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<Employee>))]
    public IActionResult GetEmployees()
    {
      List<EmployeeDTO> employees = [.. employeeRepository.GetEmployees().Select(MapToEmployeeDTORequest)];
      object result = CreateResult(employees);
      return Ok(result);
    }

    [HttpGet("{employeeId}")]
    [ProducesResponseType(200, Type = typeof(EmployeeDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetEmployee(string employeeId)
    {
      if(!employeeRepository.EmployeeExists(employeeId))
        return NotFound();

      EmployeeDTO employee = MapToEmployeeDTORequest(employeeRepository.GetEmployee(employeeId));
      return Ok(employee);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateEmployee([FromBody] EmployeeDTO employeeCreate)
    {
      if(employeeCreate == null)
        return BadRequest();

      Status? status = statusRepository.GetStatusByName("Activo", Enums.StatusType.Employee);
      EmployeeRelatedEntities? relatedEntities = employeeRepository.GetRelatedEntities(employeeCreate);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      Employee employee = MapToEmployeeModel(employeeCreate, relatedEntities);
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
        return BadRequest("Employee cannot be null");

      Employee employee = employeeRepository.GetEmployee(employeeId);
      if(employee == null)
        return NotFound("Employee Not Found");

      EmployeeRelatedEntities? relatedEntities = employeeRepository.GetRelatedEntities(updateEmployee);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      MapToUpdateEmployeeModel(employee, updateEmployee, relatedEntities);
      if(!employeeRepository.UpdateEmployee(updateEmployee.Projects, employee))
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

      Employee employeeToDelete = employeeRepository.GetEmployee(employeeId);
      if(!employeeRepository.DeleteEmployee(employeeToDelete))
        return StatusCode(500, "Something went wrong deleting employee");

      return NoContent();
    }

    private static Employee MapToEmployeeModel(EmployeeDTO employeeCreate, EmployeeRelatedEntities relatedEntities) =>
      new()
      {
        EmployeeId = Guid.NewGuid().ToString(),
        Key = employeeCreate.Key.ToString("D6"),
        Name = employeeCreate.Name,
        RFC = employeeCreate.RFC,
        CURP = employeeCreate.CURP,
        BankId = employeeCreate.Bank,
        Bank = relatedEntities.Bank,
        InterbankCode = employeeCreate.InterbankCode,
        BankAccount = employeeCreate.BankAccount,
        BankPortal = employeeCreate.BankPortal,
        IsAStarter = employeeCreate.IsAStarter,
        RegimeId = employeeCreate.Regime,
        Regime = relatedEntities.Regime,
        NSS = employeeCreate.NSS,
        DateAdmission = DateTime.ParseExact(employeeCreate.DateAdmission, "yyyy-MM-dd", CultureInfo.InvariantCulture),
        JobPositionId = employeeCreate.JobPosition,
        JobPosition = relatedEntities.JobPosition,
        CommercialAreaId = employeeCreate.CommercialArea,
        CommercialArea = relatedEntities.CommercialArea,
        ContractId = employeeCreate.Contract,
        Contract = relatedEntities.Contract,
        BaseSalary = employeeCreate.BaseSalary,
        DailySalary = employeeCreate.BaseSalary / 7,
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

    private static void MapToUpdateEmployeeModel(Employee employee, EmployeeDTO updateEmployee, EmployeeRelatedEntities relatedEntities)
    {
      employee.Key = updateEmployee.Key.ToString("D6");
      employee.Name = updateEmployee.Name;
      employee.RFC = updateEmployee.RFC;
      employee.CURP = updateEmployee.CURP;
      employee.BankId = updateEmployee.Bank;
      employee.Bank = relatedEntities.Bank;
      employee.InterbankCode = updateEmployee.InterbankCode;
      employee.BankAccount = updateEmployee.BankAccount;
      employee.BankPortal = updateEmployee.BankPortal;
      employee.IsAStarter = updateEmployee.IsAStarter;
      employee.RegimeId = updateEmployee.Regime;
      employee.Regime = relatedEntities.Regime;
      employee.NSS = updateEmployee.NSS;
      employee.DateAdmission = DateTime.ParseExact(updateEmployee.DateAdmission, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      employee.JobPositionId = updateEmployee.JobPosition;
      employee.JobPosition = relatedEntities.JobPosition;
      employee.CommercialAreaId = updateEmployee.CommercialArea;
      employee.CommercialArea = relatedEntities.CommercialArea;
      employee.ContractId = updateEmployee.Contract;
      employee.Contract = relatedEntities.Contract;
      employee.BaseSalary = updateEmployee.BaseSalary;
      employee.DailySalary = updateEmployee.BaseSalary / 7;
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
      if (employee == null) return new EmployeeDTO();

      return new EmployeeDTO()
      {
        EmployeeId = employee.EmployeeId,
        Key = ushort.Parse(employee.Key),
        Name = employee.Name,
        RFC = employee.RFC,
        CURP = employee.CURP,
        Company = employee.Company.Name,
        Bank = employee.Bank.Name,
        InterbankCode = employee.InterbankCode,
        BankAccount =  employee.BankAccount,
        BankPortal = employee.BankPortal,
        IsAStarter = employee.IsAStarter,
        Regime = employee.Regime?.Name,
        NSS = employee.NSS,
        DateAdmission = employee.DateAdmission.ToString("yyyy-MM-dd"),
        JobPosition = employee.JobPosition.Name,
        Department = employee.JobPosition.Department.Name,
        CommercialArea = employee.CommercialArea?.Name,
        Contract = employee.Contract?.Name,
        BaseSalary = employee.BaseSalary,
        DailySalary = employee.BaseSalary / 7,
        FederalEntity = employee.FederalEntity?.Name,
        Phone = employee.Phone,
        Email = employee.Email,
        Direction = employee.Direction,
        Suburb = employee.Suburb,
        PostalCode = employee.PostalCode,
        City = employee.City,
        State = employee.State?.Name,
        Country = employee.Country,
        Status = employee.Status.Name,
        IsProvider = employee.IsProvider,
        Credit = employee.Credit,
        Contact = employee.Contact,
        Projects = [.. employee.EmployeeProjects.Select(ep => 
          new EmployeeProjectRelatedEntities
          {
            ProjectId = ep.ProjectId,
            Name = ep.Project.Name,
            Date = ep.AssignedDate.ToString("yyyy-MM-dd")
          })]
      };
    }

    private object CreateResult(IEnumerable<EmployeeDTO> employees)
    {
      List<string> columns = [];
      List<EmployeeListDTO> auxEmployees = [.. employees.Select(e => 
      {
        EmployeeListDTO employee = new()
        {
          EmployeeId = e.EmployeeId,
          Key = e.Key.ToString("D6"),
          Name = e.Name,
          RFC = e.RFC,
          CURP = e.CURP,
          Bank = e.Bank,
          BankAccount = e.BankAccount,
          Projects = e.Projects,
          NSS = e.NSS,
          DateAdmission = e.DateAdmission,
          JobPosition = e.JobPosition,
          Department = e.Department,
          CommercialArea = e.CommercialArea,
          BaseSalary = e.BaseSalary,
          DailySalary = e.DailySalary,
          Phone = e.Phone,
          Email = e.Email,
          Status = e.Status,
          Company = e.Company,
        };

        employeeRepository.GetColumnsFromRelatedEntity(employee, columns);
        return employee;
      })];

      List<string> formColumns = employeeRepository.GetColumns();
      formColumns.Add("Projects");
      formColumns.Add("Department");

      foreach(EmployeeListDTO employee in auxEmployees)
        SetNullValues(employee);

      foreach(EmployeeDTO employee in employees)
        SetNullValues(employee);

      return new
      {
        Columns = columns.Count > 0 ? columns : employeeRepository.GetColumns(),
        FormColumns = formColumns,
        Data = auxEmployees,
        FormData = employees
      };
    }

    private static void SetNullValues(object obj)
    {
      Dictionary<Type, object> defaultValues = new()
      {
        { typeof(string), "" },
        { typeof(int), 0 },
        { typeof(double), 0.0 },
        { typeof(float), 0f },
        { typeof(decimal), 0m },
        { typeof(ushort), (ushort)0 }
      };

      foreach(PropertyInfo prop in obj.GetType().GetProperties())
        if(prop.GetValue(obj) == null && defaultValues.TryGetValue(prop.PropertyType, out object? defaultValue))
        {
          prop.SetValue(obj, defaultValue!);
          Console.WriteLine($"{ prop.Name }: { prop.GetValue(obj) } | { prop.PropertyType } | { defaultValue }");
        }
    }
  }
}