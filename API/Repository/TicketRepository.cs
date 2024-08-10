using System.Globalization;
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
      int weekNumber = calendar.GetWeekOfYear(today, CalendarWeekRule.FirstDay, DayOfWeek.Monday);

      return IncludeRelatedEntities(context.Tickets).Where(t =>
        t.Period.Week == weekNumber &&
        t.Period.Year == DateTime.Now.Year).ToList();
    }
    public ICollection<Ticket> GetTicketsByWeekAndYear(int week, int year) =>
      IncludeRelatedEntities(context.Tickets)
        .Where(t => t.Period.Week == week && t.Period.Year == year)
        .ToList();
    public Ticket GetTicket(string ticketId) => 
      IncludeRelatedEntities(context.Tickets).FirstOrDefault(t => t.TicketId == ticketId)
      ?? throw new Exception("No Ticket with the specified id was found");
    public TicketRelatedEntities? GetRelatedEntities(TicketDTO ticketDTO)=>
      (from e in context.Employees
        join jp in context.JobPositions on e.JobPositionId equals jp.JobPositionId
        join d in context.Departments on jp.JobPositionId equals d.DepartmentId
        join c in context.Companies on e.CompanyId equals c.CompanyId
        join s in context.Statuses on ticketDTO.Status equals s.StatusId
        join pr in context.Periods on ticketDTO.Period equals pr.PeriodId
        where ticketDTO.Employee == e.EmployeeId &&
          ticketDTO.Status == s.StatusId &&
          ticketDTO.Period == pr.PeriodId
        select new TicketRelatedEntities
        {
          Employee = e,
          JobPosition = jp,
          Department = d,
          Company = c,
          Status = s,
          Period = pr
        }).FirstOrDefault();
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