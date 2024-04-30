using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeeController(IEmployeeRepository employeeRepository,
    ICompanyRepository companyRepository, IBankRepository bankRepository,
    IJobPositionRepository jobPositionRepository, ICommercialAreaRepository commercialAreaRepository,
    IStatusRepository statusRepository, IStateReporitory stateRepository) : Controller
  {
    private readonly IEmployeeRepository employeeRepository = employeeRepository;
    private readonly ICompanyRepository companyRepository = companyRepository;
    private readonly IBankRepository bankRepository = bankRepository;
    private readonly IJobPositionRepository jobPositionRepository = jobPositionRepository;
    private readonly ICommercialAreaRepository commercialAreaRepository = commercialAreaRepository;
    private readonly IStatusRepository statusRepository = statusRepository;
    private readonly IStateReporitory stateRepository = stateRepository;

    private EmployeeDTO MapToEmployeeDTORequest(Employee? employee)
    {
      if (employee == null)
        return new EmployeeDTO();

      var employeeDTO = new EmployeeDTO
      {
        EmployeeId = employee.EmployeeId,
        Key = employee.Key,
        Name = employee.Name,
        RFC = employee.RFC,
        CURP = employee.CURP,
        Company = companyRepository.GetCompany(employee.CompanyId).Name,
        Bank = bankRepository.GetBank(employee.BankId).Name,
        InterbankCode = employee.InterbankCode,
        NSS = employee.NSS,
        JobPosition = jobPositionRepository.GetJobPosition(employee.JobPositionId).Name,
        CommercialArea = commercialAreaRepository.GetCommercialArea(employee.CommercialAreaId).Name,
        DateAdmission = employee.DateAdmission,
        BaseSalary = employee.BaseSalary,
        DailySalary = employee.DailySalary,
        Status = statusRepository.GetStatus(employee.StatusId).Name,
        Phone = employee.Phone,
        Email = employee.Email,
        Direction = employee.Direction,
        PostalCode = employee.PostalCode,
        City = employee.City,
        State = stateRepository.GetState(employee.StateId).Name
      };

      System.Console.WriteLine($"{employee.EmployeeProjects.Count}");

      foreach(var employeeProject in employee.EmployeeProjects)
      {
        Console.WriteLine($"{employeeProject.Project.Name}");
        employeeDTO.Projects.Add(employeeProject.Project.Name);
      }

      return employeeDTO;
    }

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<Employee>))]
    public IActionResult GetEmployees()
    {
      var employees = employeeRepository.GetEmployees().Select(e => MapToEmployeeDTORequest(e)).ToList();
      return Ok(employees);
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
      return Ok(employeeDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateEmployee([FromBody] EmployeeDTO employeeCreate)
    {
      if(employeeCreate == null)
        return BadRequest();

      var employee = new Employee
      {
        EmployeeId = Guid.NewGuid().ToString(),
        Key = employeeCreate.Key,
        Name = employeeCreate.Name,
        RFC = employeeCreate.RFC,
        CURP = employeeCreate.CURP,
        CompanyId = employeeCreate.Company,
        Company = companyRepository.GetCompany(employeeCreate.Company),
        BankId = employeeCreate.Bank,
        Bank = bankRepository.GetBank(employeeCreate.Bank),
        InterbankCode = employeeCreate.InterbankCode,
        NSS = employeeCreate.NSS,
        JobPositionId = employeeCreate.JobPosition,
        JobPosition = jobPositionRepository.GetJobPosition(employeeCreate.JobPosition),
        CommercialAreaId = employeeCreate.CommercialArea,
        CommercialArea = commercialAreaRepository.GetCommercialArea(employeeCreate.CommercialArea),
        DateAdmission = employeeCreate.DateAdmission,
        BaseSalary = employeeCreate.BaseSalary,
        DailySalary = employeeCreate.DailySalary,
        StatusId = employeeCreate.Status,
        Status = statusRepository.GetStatus(employeeCreate.Status),
        Phone = employeeCreate.Phone,
        Email = employeeCreate.Email,
        Direction = employeeCreate.Direction,
        PostalCode = employeeCreate.PostalCode,
        City = employeeCreate.City,
        StateId = employeeCreate.State,
        State = stateRepository.GetState(employeeCreate.State)
      };

      System.Console.WriteLine($"Projects: {employeeCreate.Projects}");

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