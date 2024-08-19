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
      var tickets = ticketRepository.GetTickets().Select(MapToTicketDTORequest);
      var result = CreateResult(tickets);

      return Ok(result);
    }

    [HttpGet("by")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TicketDTO>))]
    public IActionResult GetTicketsByWeekAndYear([FromQuery] ushort week, [FromQuery] ushort year)
    {
      var tickets = ticketRepository.GetTicketsByWeekAndYear(week, year).Select(MapToTicketDTORequest);
      var result = CreateResult(tickets);

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
      
      var ticket = MapToTicketDTORequest(ticketRepository.GetTicket(ticketId));
      return Ok(ticket);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateTicket([FromBody] TicketDTO createTicket)
    {
      if(createTicket == null)
        return BadRequest();

      var relatedEntities = ticketRepository.GetRelatedEntities(createTicket);
      if(relatedEntities == null)
        return StatusCode(500, "Something went wrong while fetching related data");

      var ticket = MapToTicketModel(createTicket, relatedEntities);
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
      
      var ticket = ticketRepository.GetTicket(ticketId);
      if(ticket == null)
        return NotFound("Employee Not Found");
      
      var relatedEntities = ticketRepository.GetRelatedEntities(updateTicket);
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
        return StatusCode(500, "Something went wrong deleting employee");

      return NoContent();
    }

    private static Ticket MapToTicketModel(TicketDTO createTicket, TicketRelatedEntities relatedEntities)
    {
      if(string.IsNullOrEmpty(createTicket.PayrollType) || !TryConvertToStatusType(createTicket.PayrollType, out PayrollType payrollType))
        payrollType = PayrollType.Error;

      return new()
      {
        TicketId = Guid.NewGuid().ToString(),
        Serie = createTicket.Serie,
        Bill = createTicket.Bill,
        EmployeeId = createTicket.Employee,
        Employee = relatedEntities.Employee,
        JobPosition = relatedEntities.JobPosition.Name,
        Department = relatedEntities.Department.Name,
        Total = createTicket.Total,
        Projects = string.Join(", ", relatedEntities.Projects
          .OrderBy(p => p.Name, StringComparer.OrdinalIgnoreCase)
          .ThenBy(p => {
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
        TotalPerceptions = createTicket.Perceptions.Sum(p => p.Value),
        TotalDeductions = createTicket.Deductions.Sum(d => d.Value)
      };
    }

    private static void MapToUpdateTicketModel(Ticket ticket, TicketDTO updateTicket, TicketRelatedEntities relatedEntities)
    {
      if(string.IsNullOrEmpty(updateTicket.PayrollType) || !TryConvertToStatusType(updateTicket.PayrollType, out PayrollType payrollType))
        payrollType = PayrollType.Error;

      ticket.Serie = updateTicket.Serie;
      ticket.Bill = updateTicket.Bill;
      ticket.EmployeeId = updateTicket.Employee;
      ticket.Employee = relatedEntities.Employee;
      ticket.Total = updateTicket.Total;
      ticket.Observations = updateTicket.Observations;
      ticket.PayrollType = payrollType;
      ticket.StatusId = updateTicket.Status;
      ticket.Status = relatedEntities.Status;
      ticket.ReceiptOfDate = DateTime.ParseExact(updateTicket.ReceiptOfDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      ticket.PaymentDate = DateTime.ParseExact(updateTicket.PaymentDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
      ticket.PeriodId = relatedEntities.Period.PeriodId;
      ticket.Period = relatedEntities.Period;
      ticket.TotalPerceptions = updateTicket.Perceptions.Sum(p => p.Value);
      ticket.TotalDeductions = updateTicket.Deductions.Sum(d => d.Value);
    }

    private TicketDTO MapToTicketDTORequest(Ticket? ticket)
    {
      if(ticket == null) return new TicketDTO();

      var ticketDTO = new TicketDTO
      {
        TicketId = ticket.TicketId,
        Serie = ticket.Serie,
        Bill = ticket.Bill,
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
        PayrollType = ticket.PayrollType.ToString(),
        Week = ticket.Period.Week,
        Year = ticket.Period.Year,
        Perceptions = new HashSet<TicketPerceptionRelatedEntities>(ticket.TicketPerceptions.Select(p => 
          new TicketPerceptionRelatedEntities
          {
            PerceptionId = p.PerceptionId,
            Name = p.Perception.Description,
            Value = p.Total
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
      HashSet<string> columns = [];
      var auxTickets = tickets.Select(t =>
      {
        var ticket = new TicketList
        {
          TicketId = t.TicketId,
          Serie = t.Serie,
          Bill = t.Bill,
          Employee = t.Employee,
          JobPosition = t.JobPosition,
          Department = t.Department,
          Perceptions = t.Perceptions,
          Deductions = t.Deductions,
          Status = t.Status,
          Total = t.Total,
          Company = t.Company,
          Projects = t.Projects,
          Observations = t.Observations
        };

        ticketRepository.GetColumnsFromRelatedEntity(ticket, columns);
        return ticket;
      }).ToList();

      var ticketsToSend = auxTickets.Select(auxTicket =>
      {
        var additionalProperties = auxTicket.Perceptions
          .Where(p => p.Value > 0)
          .ToDictionary(p => p.Name ?? "Unknown Perception", p => (object)p.Value)
          .Concat(
            auxTicket.Deductions
              .Where(d => d.Value > 0)
              .ToDictionary(d => d.Name ?? "Unknown Deduction", d => (object)d.Value)
          )
          .ToDictionary(kv => kv.Key, kv => kv.Value);

        var ticket = new TicketListDTO
        {
          TicketId = auxTicket.TicketId,
          Serie = auxTicket.Serie,
          Bill = auxTicket.Bill,
          Employee = auxTicket.Employee,
          JobPosition = auxTicket.JobPosition,
          Department = auxTicket.Department,
          AdditionalProperties = additionalProperties,
          Status = auxTicket.Status,
          Total = auxTicket.Total,
          Company = auxTicket.Company,
          Projects = auxTicket.Projects,
          Observations = auxTicket.Observations
        };

        return ticket;
      });

      return new
      {
        Columns = columns,
        FormColumns = ticketRepository.GetColumns(),
        Data = ticketsToSend,
        FormData = tickets
      };
    }

    private static bool TryConvertToStatusType<TEnum>(string value, out TEnum enumValue) where TEnum : struct, Enum =>
      Enum.TryParse(value, ignoreCase: true, out enumValue);
  }
}