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
        join jp in context.JobPositions on employeeCreate.JobPosition equals jp.JobPositionId
        join ca in context.CommercialAreas on employeeCreate.CommercialArea equals ca.CommercialAreaId
        join s in context.Statuses on employeeCreate.Status equals s.StatusId
        join st in context.States on employeeCreate.State equals st.StateId
        select new
        {
          Company = c,
          Bank = b,
          JobPosition = jp,
          CommercialArea = ca,
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
        CompanyId = employeeCreate.Company,
        Company = result.Company,
        BankId = employeeCreate.Bank,
        Bank = result.Bank,
        InterbankCode = employeeCreate.InterbankCode,
        NSS = employeeCreate.NSS,
        JobPositionId = employeeCreate.JobPosition,
        JobPosition = result.JobPosition,
        CommercialAreaId = employeeCreate.CommercialArea,
        CommercialArea = result.CommercialArea,
        DateAdmission = employeeCreate.DateAdmission,
        BaseSalary = employeeCreate.BaseSalary,
        DailySalary = employeeCreate.DailySalary,
        StatusId = employeeCreate.Status,
        Status = result.Status,
        Phone = employeeCreate.Phone,
        Email = employeeCreate.Email,
        Direction = employeeCreate.Direction,
        PostalCode = employeeCreate.PostalCode,
        City = employeeCreate.City,
        StateId = employeeCreate.State,
        State = result.State
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