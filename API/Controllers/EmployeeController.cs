using Microsoft.AspNetCore.Mvc;
using Payroll.Data;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeeController( DataContext context,
    IEmployeeRepository employeeRepository, ICompanyRepository companyRepository, 
    IBankRepository bankRepository, IJobPositionRepository jobPositionRepository, 
    ICommercialAreaRepository commercialAreaRepository, IStatusRepository statusRepository, 
    IStateReporitory stateRepository,  IEmployeeProjectsRepository employeeProjectsRepository, 
    IProjectRepository projectRepository) : Controller
  {
    private readonly DataContext context = context;
    private readonly IEmployeeRepository employeeRepository = employeeRepository;
    private readonly ICompanyRepository companyRepository = companyRepository;
    private readonly IBankRepository bankRepository = bankRepository;
    private readonly IJobPositionRepository jobPositionRepository = jobPositionRepository;
    private readonly ICommercialAreaRepository commercialAreaRepository = commercialAreaRepository;
    private readonly IStatusRepository statusRepository = statusRepository;
    private readonly IStateReporitory stateRepository = stateRepository;
    private readonly IEmployeeProjectsRepository employeeProjectsRepository = employeeProjectsRepository;
    private readonly IProjectRepository projectRepository = projectRepository;

    private EmployeeDTO MapToEmployeeDTORequest(Employee? employee)
    {
      if (employee == null)
        return new EmployeeDTO();

      var employeeDTO = new EmployeeDTO();

      var query = from e in context.Employees
        join c in context.Companies on e.CompanyId equals c.CompanyId
        join b in context.Banks on e.BankId equals b.BankId
        join jp in context.JobPositions on e.JobPositionId equals jp.JobPositionId
        join ca in context.CommercialAreas on e.CommercialAreaId equals ca.CommercialAreaId
        join s in context.Statuses on e.StatusId equals s.StatusId
        join st in context.States on e.StateId equals st.StateId
        where e.EmployeeId == employee.EmployeeId
        select new
        {
          Employee = e,
          CompanyName = c.Name,
          BankName = b.Name,
          JobPositionName = jp.Name,
          CommercialAreaName = ca.Name,
          StatusName = s.Name,
          StateName = st.Name,
          Projects = context.EmployeeProjects
            .Where(ep => ep.EmployeeId == e.EmployeeId)
            .Select(ep => context.Projects.Where(p => p.ProjectId == ep.ProjectId).FirstOrDefault().Name)
            .ToList()
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
          employeeDTO.NSS = result.Employee.NSS;
          employeeDTO.JobPosition = result.JobPositionName;
          employeeDTO.CommercialArea = result.CommercialAreaName;
          employeeDTO.DateAdmission = result.Employee.DateAdmission;
          employeeDTO.BaseSalary = result.Employee.BaseSalary;
          employeeDTO.DailySalary = result.Employee.DailySalary;
          employeeDTO.Status = result.StatusName;
          employeeDTO.Phone = result.Employee.Phone;
          employeeDTO.Email = result.Employee.Email;
          employeeDTO.Direction = result.Employee.Direction;
          employeeDTO.PostalCode = result.Employee.PostalCode;
          employeeDTO.City = result.Employee.City;
          employeeDTO.State = result.StateName;
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