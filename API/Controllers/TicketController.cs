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
  public class TicketController(ITicketRepository ticketRepository, IPayrollRepository payrollRepository) : Controller
  {
    private readonly ITicketRepository ticketRepository = ticketRepository;
    private readonly IPayrollRepository payrollRepository = payrollRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TicketDTO>))]
    public IActionResult GetTickets()
    {
      IEnumerable<TicketDTO> tickets = ticketRepository.GetTickets().Select(MapToTicketDTORequest);
      object result = CreateResult(tickets);
      return Ok(result);
    }

    [HttpGet("type")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TicketDTO>))]
    public IActionResult GetTicketsByPayroll([FromQuery] string payrollType)
    {
      IEnumerable<TicketDTO> tickets = ticketRepository.GetTickets(payrollType).Select(MapToTicketDTORequest);
      object result = CreateResult(tickets);
      return Ok(result);
    }

    [HttpGet("by")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TicketDTO>))]
    public IActionResult GetTicketsByWeekAndYear([FromQuery] ushort week, [FromQuery] ushort year, [FromQuery] string payrollType)
    {
      IEnumerable<TicketDTO> tickets = ticketRepository.GetTicketsByWeekAndYear(week, year, payrollType).Select(MapToTicketDTORequest);
      object result = CreateResult(tickets);
      return Ok(result);
    }

    [HttpGet("amount")]
    [ProducesResponseType(200, Type = typeof(float))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetTicketsAmount([FromQuery] string payrollType)
    {
      if (payrollType == "Principal")
      {
        var payroll = payrollRepository.GetPrincipalPayroll();
        payrollType = payroll.Name;
      } else if(payrollRepository.GetPayrollByName(payrollType) == null)
        return NotFound();

      return Ok(ticketRepository.GetTotalSum(payrollType));
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

    private Ticket MapToTicketModel(TicketDTO createTicket, TicketRelatedEntities relatedEntities)
    {
      var (nextSerie, nextBill) = ticketRepository.GenerateNextTicket();
      DateTime friday = GetTicketDates();
      float totalPerceptions = createTicket.Perceptions.Sum(p => p.Value);
      float totalDeductions = createTicket.Deductions.Sum(d => d.Value);
      string projects = string.Join(", ", relatedEntities.Projects
        .OrderBy(p => p.Name, StringComparer.OrdinalIgnoreCase)
        .ThenBy(p =>
        {
          string number = new(p.Name.Where(char.IsDigit).ToArray());
          return int.TryParse(number, out int result) ? result : int.MaxValue;
        })
        .Select(p => p.Name));

      return new()
      {
        TicketId = Guid.NewGuid().ToString(),
        Serie = nextSerie,
        Bill = nextBill,
        Employee = relatedEntities.Employee.Name,
        JobPosition = relatedEntities.JobPosition.Name,
        Department = relatedEntities.Department.Name,
        Total = totalPerceptions - totalDeductions,
        Projects = projects,
        Observations = createTicket.Observations?.Length > 0 ? createTicket.Observations : "Sin Observaciones",
        Company = relatedEntities.Company.Name,
        PayrollType = relatedEntities.Payroll.Name,
        Status = relatedEntities.Status.Name,
        ReceiptOfDate = friday,
        PaymentDate = friday,
        PeriodId = relatedEntities.Period.PeriodId,
        Period = relatedEntities.Period,
        TotalPerceptions = totalPerceptions,
        TotalDeductions = totalDeductions,
        Discount = createTicket.Discount ?? 0
      };
    }

    private static void MapToUpdateTicketModel(Ticket ticket, TicketDTO updateTicket, TicketRelatedEntities relatedEntities)
    {
      float totalPerceptions = updateTicket.Perceptions.Sum(p => p.Value);
      float totalDeductions = updateTicket.Deductions.Sum(d => d.Value);

      ticket.Employee = relatedEntities.Employee.Name;
      ticket.JobPosition = relatedEntities.JobPosition.Name;
      ticket.Department = relatedEntities.Department.Name;
      ticket.Total = totalPerceptions - totalDeductions;
      ticket.Observations = updateTicket.Observations ?? "Sin Observaciones";
      ticket.PayrollType = relatedEntities.Payroll.Name;
      ticket.Status = relatedEntities.Status.Name;
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
        Employee = ticket.Employee,
        JobPosition = ticket.JobPosition,
        Department = ticket.Department,
        Status = ticket.Status,
        Total = ticket.Total,
        Company = ticket.Company,
        Projects = ticket.Projects,
        Observations = ticket.Observations,
        ReceiptOfDate = ticket.ReceiptOfDate.ToString("yyyy-MM-dd"),
        PaymentDate = ticket.PaymentDate.ToString("yyyy-MM-dd"),
        Payroll = ticket.PayrollType.ToString(),
        Discount = ticket.Discount,
        Perceptions = [.. ticket.TicketPerceptions.Select(p => 
          new TicketPerceptionRelatedEntities
          {
            PerceptionId = p.PerceptionId,
            Name = p.Name,
            Value = p.Total,
            CompensationType = DetermineCompensationType(p.Name).ToString()
          })],
        Deductions = [.. ticket.TicketDeductions.Select(d => 
          new TicketDeductionRelatedEntities
          {
            DeductionId = d.DeductionId,
            Name = d.Name,
            Value = d.Total
          })]
      };
      
      return ticketDTO;
    }

    private object CreateResult(IEnumerable<TicketDTO> tickets)
    {
      List<string> columns = [];
      List<string> formColumns = [];

      List<TicketFormDTO> formTickets = [.. tickets.Select(t =>
      {
        TicketFormDTO ticket = new()
        {
          TicketId = t.TicketId,
          Serie = t.Serie,
          Bill = t.Bill,
          Payroll = t.Payroll,
          Employee = t.Employee,
          Status = t.Status,
          ReceiptOfDate = t.ReceiptOfDate ?? DateTime.MinValue.ToString("yyyy-MM-dd"),
          PaymentDate = t.PaymentDate ?? DateTime.MinValue.ToString("yyyy-MM-dd"),
          Observations = t.Observations
        };

        ticketRepository.GetColumnsFromRelatedEntity(ticket, formColumns);
        ticket.Perceptions = t.Perceptions;
        ticket.Deductions = t.Deductions;
        ticket.Discount = t.Discount ?? 0;
        return ticket;
      })];

      List<TicketList> listTickets = [.. tickets.Select(t =>
      {
        float totalPerceptions = t.Perceptions.Sum(p => p.Value);
        float totalDeductions = t.Deductions.Sum(d => d.Value);
        var baseSalaryPerception = t.Perceptions.FirstOrDefault(p => p.Name == "Sueldo");
        if(baseSalaryPerception == null)
        {
          float baseSalary = ticketRepository.GetBaseSalaryEmployee(t.Employee, t.JobPosition!, t.Department!);
          t.Perceptions.Add(new TicketPerceptionRelatedEntities { Name = "Sueldo", Value = baseSalary });
          t.Perceptions.Add(new TicketPerceptionRelatedEntities { Name = "Hora Extra", Value = 0 });
          totalPerceptions += baseSalary;
        }

        TicketList ticket = new()
        {
          TicketId = t.TicketId,
          Serie = t.Serie,
          Bill = t.Bill,
          Employee = t.Employee,
          JobPosition = t.JobPosition,
          Department = t.Department,
          Status = t.Status,
          Perceptions = t.Perceptions,
          Deductions = t.Deductions,
          Total = totalPerceptions - totalDeductions,
          Company = t.Company,
          Projects = t.Projects,
          PaymentDate = DateTime.ParseExact(
            t.PaymentDate ?? DateTime.MinValue.ToString("yyyy-MM-dd"),
            "yyyy-MM-dd", CultureInfo.InvariantCulture
          ).ToString("dd-MM-yyyy"),
          Observations = t.Observations
        };

        ticket.Perceptions = [.. ticket.Perceptions.OrderByDescending(p => p.Value)];
        ticket.Deductions = [.. ticket.Deductions.OrderByDescending(d => d.Value)];
        ticketRepository.GetColumnsFromRelatedEntity(ticket, columns);
        return ticket;
      })];

      var (filteredPerceptions, filteredDeductions) = ticketRepository.GetFilteredPerceptionsAndDeductions(columns);
      IEnumerable<TicketListDTO> ticketsToSend = listTickets.Select(auxTicket =>
      {
        var additionalProperties = auxTicket.Perceptions
          .Where(p => p.Value > 0 && p.Name != "Sueldo" && p.Name != "Hora Extra")
          .Select((p, i) => new KeyValuePair<string, object>(p.Name ?? $"Unknown Perception { i }", p.Value))
          .Concat(
              auxTicket.Deductions
                  .Where(d => d.Value > 0)
                  .Select((d, i) => new KeyValuePair<string, object>(d.Name ?? $"Unknown Deduction { i }", d.Value))
          )
          .GroupBy(kv => kv.Key)
          .ToDictionary(g => g.Key, g => g.First().Value);

        if(!additionalProperties.ContainsKey("Sueldo"))
          additionalProperties["Sueldo"] = ticketRepository.GetBaseSalaryEmployee(auxTicket.Employee, auxTicket.JobPosition!, auxTicket.Department!);

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
          PaymentDate = auxTicket.PaymentDate,
          Observations = auxTicket.Observations
        };

        return ticket;
      });

      if(ticketsToSend.Any() || formTickets.Count > 0)
      {
        formColumns.Insert(formColumns.Count - 1, "Perceptions");
        formColumns.Insert(formColumns.Count, "Deductions");
      }

      columns.Remove("EmployeeId");
      return new
      {
        Columns = columns.Count > 0 ? columns : ticketRepository.GetColumns(),
        FormColumns = formColumns,
        Data = ticketsToSend,
        FormData = formTickets
      };
    }

    private static DateTime GetTicketDates()
    {
      DateTime today = DateTime.Today;
      int dayOfWeek = (int)today.DayOfWeek;
      if(dayOfWeek == 0) dayOfWeek = 7;
      DateTime monday = today.AddDays(-(dayOfWeek - 1));
      return monday.AddDays(4);
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
  }
}