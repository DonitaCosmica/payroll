using System.Globalization;
using System.Linq.Expressions;
using API.Data;
using API.DTO;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
  public class TicketRepository(DataContext context) : ITicketRepository
  {
    private readonly DataContext context = context;

    public ICollection<Ticket> GetTickets()
    {
      DateTime today = DateTime.Now;
      CultureInfo culture = new("es-MX");
      Calendar calendar = culture.Calendar;
      DateTime startOfWeek = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
      DateTime startOfPreviousWeek = startOfWeek.AddDays(-8);

      ushort currentWeek = (ushort)calendar.GetWeekOfYear(today, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
      ushort currentYear = (ushort)today.Year;
      ushort previousWeek = (ushort)calendar.GetWeekOfYear(startOfPreviousWeek, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
      ushort previousYear = (ushort)startOfPreviousWeek.Year;
      if(previousWeek > currentWeek && previousYear == currentWeek)
        previousYear--;

      var tickets = GetTicketsByWeekAndYear(currentWeek, currentYear);
      if(tickets.Count > 0) return tickets;

      var newPeriod = new Period
      {
        PeriodId = Guid.NewGuid().ToString(),
        Week = currentWeek,
        Year = currentYear
      };

      if(!context.CreateEntity(newPeriod)) return [];
      tickets = GetTicketsByWeekAndYear(previousWeek, previousYear);

      foreach(var ticket in tickets)
      {
        ticket.PeriodId = newPeriod.PeriodId;
        ticket.Period = newPeriod;
        if(!context.UpdateEntity(ticket)) return [];
      }

      return tickets;
    }
    public ICollection<Ticket> GetTicketsByWeekAndYear(ushort week, ushort year) =>
      IncludeRelatedEntities(context.Tickets)
        .Where(t => t.Period.Week == week && t.Period.Year == year)
        .ToList();
    public Ticket GetTicket(string ticketId) => 
      IncludeRelatedEntities(context.Tickets).FirstOrDefault(t => t.TicketId == ticketId)
      ?? throw new Exception("No Ticket with the specified id was found");
    public TicketRelatedEntities? GetRelatedEntities(TicketDTO ticketDTO) =>
      (from e in context.Employees
        join c in context.Companies on e.CompanyId equals c.CompanyId
        join jp in context.JobPositions on e.JobPositionId equals jp.JobPositionId
        join d in context.Departments on jp.DepartmentId equals d.DepartmentId
        join s in context.Statuses on ticketDTO.Status equals s.StatusId
        join pr1 in context.Periods on ticketDTO.Week equals pr1.Week
        join pr2 in context.Periods on ticketDTO.Year equals pr2.Year
        where ticketDTO.Employee == e.EmployeeId &&
          ticketDTO.Status == s.StatusId &&
          ticketDTO.Week == pr1.Week &&
          ticketDTO.Year == pr2.Year
        select new TicketRelatedEntities
        {
          Employee = e,
          Company = c,
          JobPosition = jp,
          Department = d,
          Status = s,
          Period = pr1
        }).FirstOrDefault();
    public bool CreateTicket(HashSet<TicketPerceptionRelatedEntities> perceptions, 
      HashSet<TicketDeductionRelatedEntities> deductions, Ticket ticket)
    {
      if(ticket == null) return false;

      bool addPerceptionsSuccess = context.AddRelatedEntities(
        ticket, perceptions, context.Perceptions,
        (t, p, i) => new TicketPerception
        {
          TicketPerceptionId = Guid.NewGuid().ToString(),
          TicketId = t.TicketId,
          PerceptionId = p.PerceptionId,
          Total = i.Value,
          Ticket = t,
          Perception = p
        }, 
        ticket.TicketPerceptions);

      bool addDeductionsSuccess = context.AddRelatedEntities(
        ticket, deductions, context.Deductions,
        (t, d, i) => new TicketDeduction
        {
          TicketDeductionId = Guid.NewGuid().ToString(),
          TicketId = t.TicketId,
          DeductionId = d.DeductionId,
          Total = i.Value,
          Ticket = t,
          Deduction = d
        }, 
        ticket.TicketDeductions);
      
      if(!addPerceptionsSuccess || !addDeductionsSuccess) return false;
      return context.CreateEntity(ticket);
    }
    public bool UpdateTicket(HashSet<TicketPerceptionRelatedEntities> perceptions, 
      HashSet<TicketDeductionRelatedEntities> deductions, Ticket ticket)
    {
      if(ticket == null) return false;

      bool removePerceptionsSuccess = context.RemoveRelatedEntities(
        ticket.TicketId, 
        t => t.TicketPerceptions, 
        context.Tickets, 
        context.TicketPerceptions);

      bool removeDeductionsSuccess = context.RemoveRelatedEntities(
        ticket.TicketId, 
        t => t.TicketDeductions, 
        context.Tickets, 
        context.TicketDeductions);

      if(!removePerceptionsSuccess || !removeDeductionsSuccess) return false;

      bool addPerceptionsSuccess = context.AddRelatedEntities(
        ticket, perceptions, context.Perceptions,
        (t, p, i) => new TicketPerception
        {
          TicketPerceptionId = Guid.NewGuid().ToString(),
          TicketId = t.TicketId,
          PerceptionId = p.PerceptionId,
          Total = i.Value,
          Ticket = t,
          Perception = p
        }, 
        ticket.TicketPerceptions);

      bool addDeductionsSuccess = context.AddRelatedEntities(
        ticket, deductions, context.Deductions,
        (t, d, i) => new TicketDeduction
        {
          TicketDeductionId = Guid.NewGuid().ToString(),
          TicketId = t.TicketId,
          DeductionId = d.DeductionId,
          Total = i.Value,
          Ticket = t,
          Deduction = d
        }, 
        ticket.TicketDeductions);

      if(!addPerceptionsSuccess || !addDeductionsSuccess) return false;
      return context.UpdateEntity(ticket);
    }
    public bool DeleteTicket(Ticket ticket)
    {
      if(ticket == null) return false;

      bool perceptionsRemoved = context.RemoveRelatedEntities(
        ticket.TicketId, 
        t => t.TicketPerceptions, 
        context.Tickets, 
        context.TicketPerceptions);

      bool deductionsRemoved = context.RemoveRelatedEntities(
        ticket.TicketId, 
        t => t.TicketDeductions, 
        context.Tickets, 
        context.TicketDeductions);
      
      return perceptionsRemoved && deductionsRemoved && context.DeleteEntity(ticket);
    }
    public List<string> GetColumns() => context.GetColumns<Ticket>();
    public bool TicketExists(string ticketId) => context.Tickets.Any(t => t.TicketId == ticketId);
    private static IQueryable<Ticket> IncludeRelatedEntities(IQueryable<Ticket> query) =>
      query
        .Include(t => t.Employee)
          .ThenInclude(e => e.JobPosition)
            .ThenInclude(jp => jp.Department)
        .Include(t => t.Employee)
          .ThenInclude(e => e.EmployeeProjects)
            .ThenInclude(ep => ep.Project)
        .Include(t => t.Employee)
          .ThenInclude(e => e.Company)
        .Include(t => t.TicketPerceptions)
          .ThenInclude(tp => tp.Perception)
        .Include(t => t.TicketDeductions)
          .ThenInclude(td => td.Deduction)
        .Include(t => t.Status).Include(t => t.Period);
  }
}