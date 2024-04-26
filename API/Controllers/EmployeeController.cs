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

    private EmployeeDTO MapToDTO(Employee? employee)
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
        CompanyDTO = MapCompanyDTO(employee),
        BankDTO = MapBankDTO(employee),
        InterbankCode = employee.InterbankCode,
        NSS = employee.NSS,
        JobPositionDTO = MapJobPositionDTO(employee),
        CommercialAreaDTO = MapCommercialAreaDTO(employee),
        DateAdmission = employee.DateAdmission,
        BaseSalary = employee.BaseSalary,
        DailySalary = employee.DailySalary,
        StatusDTO = MapStatusDTO(employee),
        Phone = employee.Phone,
        Email = employee.Email,
        Direction = employee.Direction,
        PostalCode = employee.PostalCode,
        City = employee.City,
        StateDTO = MapStateDTO(employee)
      };

      foreach(var employeeProject in employee.EmployeeProjects)
      {
        var projectDTO = new ProjectDTO
        {
          ProjectId = employeeProject.ProjectId,
          Name = employeeProject.Project.Name
        };

        employeeDTO.Projects.Add(projectDTO);
      }

      return employeeDTO;
    }

    private CompanyDTO MapCompanyDTO(Employee employee)
    {
      var company = companyRepository.GetCompany(employee.CompanyId);
      return new CompanyDTO
      {
        CompanyId = company.CompanyId,
        Name = company.Name
      };
    }

    private BankDTO MapBankDTO(Employee employee)
    {
      var bank = bankRepository.GetBank(employee.BankId);
      return new BankDTO
      {
        BankId = bank.BankId,
        Name = bank.Name
      };
    }

    private JobPositionDTO MapJobPositionDTO(Employee employee)
    {
      var jobPosition = jobPositionRepository.GetJobPosition(employee.JobPositionId);
      return new JobPositionDTO
      {
        JobPositionId = jobPosition.JobPositionId,
        Name = jobPosition.Name,
        DepartmentId = jobPosition.DepartmentId
      };
    }

    private CommercialAreaDTO MapCommercialAreaDTO(Employee employee)
    {
      var commercialArea = commercialAreaRepository.GetCommercialArea(employee.CommercialAreaId);
      return new CommercialAreaDTO
      {
        CommercialAreaId = commercialArea.CommercialAreaId,
        Name = commercialArea.Name
      };
    }

    private StatusDTO MapStatusDTO(Employee employee)
    {
      var status = statusRepository.GetStatus(employee.StatusId);
      return new StatusDTO
      {
        StatusId = status.StatusId,
        Name = status.Name
      };
    }

    private StateDTO MapStateDTO(Employee employee)
    {
      var state = stateRepository.GetState(employee.StateId);
      return new StateDTO
      {
        StateId = state.StateId,
        Name = state.Name,
        Abbreviation = state.Abbreviation
      };
    }

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<Employee>))]
    public IActionResult GetEmployees()
    {
      var employees = employeeRepository.GetEmployees().Select(MapToDTO).ToList();
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
      var employeeDTO = MapToDTO(employee);
      return Ok(employeeDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateEmployee([FromBody] EmployeeDTO employeeCreate)
    {
      if(employeeCreate == null)
        return BadRequest();

      if(employeeCreate.CompanyDTO == null ||  string.IsNullOrEmpty(employeeCreate.CompanyDTO.CompanyId))
        return BadRequest("CompanyDTO or CompanyId is null");

      if(employeeCreate.JobPositionDTO == null || string.IsNullOrEmpty(employeeCreate.JobPositionDTO.JobPositionId))
        return BadRequest("JobPositionDTO or JobPositionId is null");

      if(employeeCreate.CommercialAreaDTO == null || string.IsNullOrEmpty(employeeCreate.CommercialAreaDTO.CommercialAreaId))
        return BadRequest("CommercialAreaDTO or CommercialAreaId is null");

      var employee = new Employee
      {
        EmployeeId = Guid.NewGuid().ToString(),
        Key = employeeCreate.Key,
        Name = employeeCreate.Name,
        RFC = employeeCreate.RFC,
        CURP = employeeCreate.CURP,
        CompanyId = employeeCreate.CompanyDTO.CompanyId,
        Company = companyRepository.GetCompany(employeeCreate.CompanyDTO.CompanyId),
        BankId = employeeCreate.BankDTO.BankId,
        Bank = bankRepository.GetBank(employeeCreate.BankDTO.BankId),
        InterbankCode = employeeCreate.InterbankCode,
        NSS = employeeCreate.NSS,
        JobPositionId = employeeCreate.JobPositionDTO.JobPositionId,
        JobPosition = jobPositionRepository.GetJobPosition(employeeCreate.JobPositionDTO.JobPositionId),
        CommercialAreaId = employeeCreate.CommercialAreaDTO.CommercialAreaId,
        CommercialArea = commercialAreaRepository.GetCommercialArea(employeeCreate.CommercialAreaDTO.CommercialAreaId),
        DateAdmission = employeeCreate.DateAdmission,
        BaseSalary = employeeCreate.BaseSalary,
        DailySalary = employeeCreate.DailySalary,
        StatusId = employeeCreate.StatusDTO.StatusId,
        Status = statusRepository.GetStatus(employeeCreate.StatusDTO.StatusId),
        Phone = employeeCreate.Phone,
        Email = employeeCreate.Email,
        Direction = employeeCreate.Direction,
        PostalCode = employeeCreate.PostalCode,
        City = employeeCreate.City,
        StateId = employeeCreate.StateDTO.StateId,
        State = stateRepository.GetState(employeeCreate.StateDTO.StateId)
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