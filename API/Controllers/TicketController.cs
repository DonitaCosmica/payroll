using System.Globalization;
using API.DTO;
using API.Enums;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TicketController(ITicketRepository ticketRepository) : Controller
  {
    private readonly ITicketRepository ticketRepository = ticketRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TicketDTO>))]
    public IActionResult GetTickets()
    {
      IEnumerable<TicketDTO> tickets = ticketRepository.GetTickets().Select(MapToTicketDTORequest);
      object result = CreateResult(tickets);
      return Ok(result);
    }

    [HttpGet("by")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TicketDTO>))]
    public IActionResult GetTicketsByWeekAndYear([FromQuery] ushort week, [FromQuery] ushort year)
    {
      IEnumerable<TicketDTO> tickets = ticketRepository.GetTicketsByWeekAndYear(week, year).Select(MapToTicketDTORequest);
      object result = CreateResult(tickets);
      return Ok(result);
    }

    [HttpGet("{ticketId}")]
    [ProducesResponseType(200, Type = typeof(TicketDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetTicket(string ticketId)
    {
      if(!ticketRepository.TicketExists(ticketId))
        return NotFound();

      TicketDTO ticket = MapToTicketDTORequest(ticketRepository.GetTicket(ticketId));
      return Ok(ticket);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateTicket([FromBody] TicketDTO createTicket)
    {
      if(createTicket == null)
        return BadRequest();

      TicketRelatedEntities? relatedEntities = ticketRepository.GetRelatedEntities(createTicket);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      Ticket ticket = MapToTicketModel(createTicket, relatedEntities);
      if(!ticketRepository.CreateTicket(createTicket.Perceptions, createTicket.Deductions, ticket))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{ticketId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateTicket(string ticketId, [FromBody] TicketDTO updateTicket)
    {
      if(updateTicket == null)
        return BadRequest("Ticket cannot be null");
      
      Ticket ticket = ticketRepository.GetTicket(ticketId);
      if(ticket == null)
        return NotFound("Employee Not Found");
      
      TicketRelatedEntities? relatedEntities = ticketRepository.GetRelatedEntities(updateTicket);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      MapToUpdateTicketModel(ticket, updateTicket, relatedEntities);
      if(!ticketRepository.UpdateTicket(updateTicket.Perceptions, updateTicket.Deductions, ticket))
        return StatusCode(500, "Something went wrong updating Employee");

      return NoContent();
    }

    [HttpDelete("{ticketId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteTicket(string ticketId)
    {
      if(!ticketRepository.TicketExists(ticketId))
        return NotFound("Ticket Not Found");

      var ticketToDelete = ticketRepository.GetTicket(ticketId);
      if(!ticketRepository.DeleteTicket(ticketToDelete))
        return StatusCode(500, "Something went wrong deleting ticket");

      return NoContent();
    }

    private static Ticket MapToTicketModel(TicketDTO createTicket, TicketRelatedEntities relatedEntities)
    {
      if(string.IsNullOrEmpty(relatedEntities.Payroll.Name) || !TryConvertToStatusType(relatedEntities.Payroll.Name, out PayrollType payrollType))
        payrollType = PayrollType.Error;

      float totalPerceptions = createTicket.Perceptions.Sum(p => p.Value);
      float totalDeductions = createTicket.Deductions.Sum(d => d.Value);

      return new()
      {
        TicketId = Guid.NewGuid().ToString(),
        Serie = createTicket.Serie,
        Bill = createTicket.Bill,
        EmployeeId = createTicket.Employee,
        Employee = relatedEntities.Employee,
        JobPosition = relatedEntities.JobPosition.Name,
        Department = relatedEntities.Department.Name,
        Total = totalPerceptions - totalDeductions,
        Projects = string.Join(", ", relatedEntities.Projects
          .OrderBy(p => p.Name, StringComparer.OrdinalIgnoreCase)
          .ThenBy(p =>
          {
            var number = new string(p.Name.Where(char.IsDigit).ToArray());
            return int.TryParse(number, out int result) ? result : 0;
          })
          .Select(p => p.Name)),
        Observations = createTicket.Observations,
        Company = relatedEntities.Company.Name,
        PayrollType = payrollType,
        StatusId = createTicket.Status,
        Status = relatedEntities.Status,
        ReceiptOfDate = DateTime.ParseExact(createTicket.ReceiptOfDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
        PaymentDate = DateTime.ParseExact(createTicket.PaymentDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
        PeriodId = relatedEntities.Period.PeriodId,
        Period = relatedEntities.Period,
        TotalPerceptions = totalPerceptions,
        TotalDeductions = totalDeductions
      };
    }

    private static void MapToUpdateTicketModel(Ticket ticket, TicketDTO updateTicket, TicketRelatedEntities relatedEntities)
    {
      if(string.IsNullOrEmpty(relatedEntities.Payroll.Name) || !TryConvertToStatusType(relatedEntities.Payroll.Name, out PayrollType payrollType))
        payrollType = PayrollType.Error;

      float totalPerceptions = updateTicket.Perceptions.Sum(p => p.Value);
      float totalDeductions = updateTicket.Deductions.Sum(d => d.Value);

      ticket.Serie = updateTicket.Serie;
      ticket.Bill = updateTicket.Bill;
      ticket.EmployeeId = updateTicket.Employee;
      ticket.Employee = relatedEntities.Employee;
      ticket.Total = totalPerceptions - totalDeductions;
      ticket.Observations = updateTicket.Observations;
      ticket.PayrollType = payrollType;
      ticket.StatusId = updateTicket.Status;
      ticket.Status = relatedEntities.Status;
      ticket.ReceiptOfDate = DateTime.ParseExact(updateTicket.ReceiptOfDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      ticket.PaymentDate = DateTime.ParseExact(updateTicket.PaymentDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      ticket.PeriodId = relatedEntities.Period.PeriodId;
      ticket.Period = relatedEntities.Period;
      ticket.TotalPerceptions = totalPerceptions;
      ticket.TotalDeductions = totalDeductions;
    }

    private TicketDTO MapToTicketDTORequest(Ticket? ticket)
    {
      if(ticket == null) return new TicketDTO();

      TicketDTO ticketDTO = new()
      {
        TicketId = ticket.TicketId,
        Serie = ticket.Serie,
        Bill = ticket.Bill,
        EmployeeId = ticket.EmployeeId,
        Employee = ticket.Employee.Name,
        JobPosition = ticket.JobPosition,
        Department = ticket.Department,
        Status = ticket.Status.Name,
        Total = ticket.Total,
        Company = ticket.Company,
        Projects = ticket.Projects,
        Observations = ticket.Observations,
        ReceiptOfDate = ticket.ReceiptOfDate.ToString("yyyy-MM-dd"),
        PaymentDate = ticket.PaymentDate.ToString("yyyy-MM-dd"),
        Payroll = ticket.PayrollType.ToString(),
        Perceptions = new HashSet<TicketPerceptionRelatedEntities>(ticket.TicketPerceptions.Select(p => 
          new TicketPerceptionRelatedEntities
          {
            PerceptionId = p.PerceptionId,
            Name = p.Perception.Description,
            Value = p.Total,
            CompensationType = DetermineCompensationType(p.Perception.Description).ToString()
          })),
        Deductions = new HashSet<TicketDeductionRelatedEntities>(ticket.TicketDeductions.Select(d => 
          new TicketDeductionRelatedEntities
          {
            DeductionId = d.DeductionId,
            Name = d.Deduction.Description,
            Value = d.Total
          }))
      };
      
      return ticketDTO;
    }

    private object CreateResult(IEnumerable<TicketDTO> tickets)
    {
      List<string> columns = [];
      List<string> formColumns = [];

      List<TicketFormDTO> formTickets = tickets.Select(t =>
      {
        TicketFormDTO ticket = new()
        {
          TicketId = t.TicketId,
          Serie = t.Serie,
          Bill = t.Bill,
          Payroll = t.Payroll,
          Employee = t.Employee,
          Status = t.Status,
          ReceiptOfDate = t.ReceiptOfDate,
          PaymentDate = t.PaymentDate,
          Observations = t.Observations
        };

        ticketRepository.GetColumnsFromRelatedEntity(ticket, formColumns);
        ticket.Perceptions = t.Perceptions;
        ticket.Deductions = t.Deductions;
        return ticket;
      }).ToList();

      List<TicketList> listTickets = tickets.Select(t =>
      {
        float totalPerceptions = t.Perceptions.Sum(p => p.Value);
        float totalDeductions = t.Deductions.Sum(d => d.Value);
        var baseSalaryPerception = t.Perceptions.FirstOrDefault(p => p.Name == "Sueldo");
        if(baseSalaryPerception == null)
        {
          float baseSalary = ticketRepository.GetBaseSalaryEmployee(t.EmployeeId!);
          t.Perceptions.Add(new TicketPerceptionRelatedEntities { Name = "Sueldo", Value = baseSalary });
          t.Perceptions.Add(new TicketPerceptionRelatedEntities { Name = "Hora Extra", Value = 0 });
          totalPerceptions += baseSalary;
        }

        TicketList ticket = new()
        {
          TicketId = t.TicketId,
          Serie = t.Serie,
          Bill = t.Bill,
          EmployeeId = t.EmployeeId,
          Employee = t.Employee,
          JobPosition = t.JobPosition,
          Department = t.Department,
          Status = t.Status,
          Perceptions = t.Perceptions,
          Deductions = t.Deductions,
          Total = totalPerceptions - totalDeductions,
          Company = t.Company,
          Projects = t.Projects,
          Observations = t.Observations
        };

        ticket.Perceptions = [.. ticket.Perceptions.OrderByDescending(p => p.Value)];
        ticket.Deductions = [.. ticket.Deductions.OrderByDescending(d => d.Value)];
        ticketRepository.GetColumnsFromRelatedEntity(ticket, columns);
        return ticket;
      }).ToList();

      var (filteredPerceptions, filteredDeductions) = ticketRepository.GetFilteredPerceptionsAndDeductions(columns);
      IEnumerable<TicketListDTO> ticketsToSend = listTickets.Select(auxTicket =>
      {
        var additionalProperties = auxTicket.Perceptions
          .Where(p => p.Value > 0 && p.Name != "Sueldo" && p.Name != "Hora Extra")
          .ToDictionary(p => p.Name ?? "Unknown Perception", p => (object)p.Value)
          .Concat(
            auxTicket.Deductions
              .Where(d => d.Value > 0)
              .ToDictionary(d => d.Name ?? "Unknown Deduction", d => (object)d.Value)
          )
          .ToDictionary(kv => kv.Key, kv => kv.Value);

        if(!additionalProperties.ContainsKey("Sueldo"))
          additionalProperties["Sueldo"] = ticketRepository.GetBaseSalaryEmployee(auxTicket.EmployeeId!);

        if(!additionalProperties.ContainsKey("Hora Extra"))
          additionalProperties["Hora Extra"] = auxTicket.Perceptions.FirstOrDefault(p => p.Name == "Hora Extra")?.Value ?? 0;

        foreach(var perception in filteredPerceptions)
        {
          if(!additionalProperties.ContainsKey(perception.Description))
            additionalProperties[perception.Description] = 0;
        }

        foreach(var deduction in filteredDeductions)
        {
          if(!additionalProperties.ContainsKey(deduction.Description))
            additionalProperties[deduction.Description] = 0;
        }

        TicketListDTO ticket = new()
        {
          TicketId = auxTicket.TicketId,
          Serie = auxTicket.Serie,
          Bill = auxTicket.Bill,
          Employee = auxTicket.Employee,
          JobPosition = auxTicket.JobPosition,
          Department = auxTicket.Department,
          Status = auxTicket.Status,
          AdditionalProperties = additionalProperties,
          Total = auxTicket.Total,
          Company = auxTicket.Company,
          Projects = auxTicket.Projects,
          Observations = auxTicket.Observations
        };

        return ticket;
      });

      if(ticketsToSend.Any() || formTickets.Count > 0)
      {
        formColumns.Insert(formColumns.Count - 1, "Perceptions");
        formColumns.Insert(formColumns.Count, "Deductions");
      }

      return new
      {
        Columns = columns,
        FormColumns = formColumns,
        Data = ticketsToSend,
        FormData = formTickets
      };
    }

    private static CompensationType DetermineCompensationType(string description)
    {
      if(description.Contains("Salario") || description.Contains("Sueldo"))
        return CompensationType.Principal;
      else if(description.Contains("Horas") || description.Contains("Extra"))
        return CompensationType.Hours;
      else if(description.Contains("Faltas"))
        return CompensationType.Days;

      return CompensationType.Normal;
    }

    private static bool TryConvertToStatusType<TEnum>(string value, out TEnum enumValue) where TEnum : struct, Enum =>
      Enum.TryParse(value, ignoreCase: true, out enumValue);
  }
}