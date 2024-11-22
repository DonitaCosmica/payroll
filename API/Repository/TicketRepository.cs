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
      var (currentWeek, currentYear, previousWeek, previousYear) = GetWeekAndYearInfo();
      var tickets = GetTicketsByWeekAndYear(currentWeek, currentYear);
      if(tickets.Count > 0) return tickets;

      var period = context.Periods.FirstOrDefault(pr => pr.Week == currentWeek && pr.Year == currentYear);
      if(period == null)
      {
        period = CreateNewPeriod(currentWeek, currentYear);
        if(period == null) return Enumerable.Empty<Ticket>().ToList();
      }

      var newTickets = CopyTicketsFromPreviousPeriod(previousWeek, previousYear, period);
      return newTickets;
    }
    public ICollection<Ticket> GetTicketsByWeekAndYear(ushort week, ushort year) =>
      [.. IncludeRelatedEntities(context.Tickets).Where(t => t.Period.Week == week && t.Period.Year == year)];
    public Ticket GetTicket(string ticketId) => 
      IncludeRelatedEntities(context.Tickets).FirstOrDefault(t => t.TicketId == ticketId)
      ?? throw new Exception("No Ticket with the specified id was found");
    public TicketRelatedEntities? GetRelatedEntities(TicketDTO ticketDTO) =>
      (from e in context.Employees
        join c in context.Companies on e.CompanyId equals c.CompanyId
        join jp in context.JobPositions on e.JobPositionId equals jp.JobPositionId
        join d in context.Departments on jp.DepartmentId equals d.DepartmentId
        join s in context.Statuses on ticketDTO.Status equals s.StatusId
        join pa in context.Payrolls on ticketDTO.Payroll equals pa.PayrollId
        join pr1 in context.Periods on ticketDTO.Week equals pr1.Week
        join pr2 in context.Periods on ticketDTO.Year equals pr2.Year
        where ticketDTO.Employee == e.EmployeeId &&
          ticketDTO.Status == s.StatusId &&
          ticketDTO.Payroll == pa.PayrollId &&
          ticketDTO.Week == pr1.Week &&
          ticketDTO.Year == pr2.Year
        select new TicketRelatedEntities
        {
          Employee = e,
          Company = c,
          JobPosition = jp,
          Department = d,
          Status = s,
          Payroll = pa,
          Period = pr1,
          Projects = (from ep in context.EmployeeProjects
            join p in context.Projects on ep.ProjectId equals p.ProjectId
            where ep.EmployeeId == e.EmployeeId
            select p).ToHashSet()
        }).FirstOrDefault();
    public (HashSet<Perception> Perceptions, HashSet<Deduction> Deductions) GetFilteredPerceptionsAndDeductions(List<string> columns)
    {
      var filterPerceptions = context.Perceptions
        .Where(p => columns.Contains(p.Description))
        .ToHashSet();
      
      var filterDeductions = context.Deductions
        .Where(d => columns.Contains(d.Description))
        .ToHashSet();

      return (filterPerceptions, filterDeductions);
    }
    public float GetBaseSalaryEmployee(string employeeName, string jobPosition, string department)
    {
      if(employeeName == null || jobPosition == null || department == null)
        throw new ArgumentNullException(nameof(employeeName), "Employee cannot be null.");
      
      var employee = context.Employees.Include(e => e.JobPosition).ThenInclude(jp => jp.Department)
        .FirstOrDefault(e => e.Name == employeeName && e.JobPosition.Name == jobPosition && e.JobPosition.Department.Name == department);
      return employee != null ? employee.BaseSalary : 0f;
    }
    public (char nextSerie, ushort nextBill) GenerateNextTicket()
    {
      var lastTicket = context.Tickets
        .OrderByDescending(t => t.Serie)
        .ThenByDescending(t => t.Bill)
        .FirstOrDefault();

      if(lastTicket == null)
        return ('A', 1);

      char currentSerie = lastTicket.Serie;
      ushort currentBill = lastTicket.Bill;
      if(currentBill < ushort.MaxValue)
        return (currentSerie, (ushort)(currentBill + 1));
      else
      {
        char nexSerie = (char)(currentSerie + 1);
        if(nexSerie > 'Z') throw new Exception("The available series are sold out.");
        return (nexSerie, 1);
      }
    }
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
          Name = p.Description,
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
          Name = d.Description,
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
          Name = p.Description,
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
          Name = d.Description,
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

      var tableWorks = context.TableWorks.Where(tw => tw.TicketId == ticket.TicketId).ToList();
      foreach (var tableWork in tableWorks)
        context.TableWorks.Remove(tableWork);
      
      return perceptionsRemoved && deductionsRemoved && context.DeleteEntity(ticket);
    }
    public void GetColumnsFromRelatedEntity<T>(T ticket, List<string> columns) where T : class => 
      context.GetColumns(ticket, columns);
    public List<string> GetColumns() => context.GetColumns<Ticket>();
    public bool TicketExists(string ticketId) => context.Tickets.Any(t => t.TicketId == ticketId);
    private static (ushort currentWeek, ushort currentYear, ushort previousWeek, ushort previousYear) GetWeekAndYearInfo()
    {
      DateTime today = DateTime.Now;
      CultureInfo culture = new("es-MX");
      Calendar calendar = culture.Calendar;
      DateTime startOfWeek = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
      DateTime startOfPreviousWeek = startOfWeek.AddDays(-7);

      ushort currentWeek = (ushort)calendar.GetWeekOfYear(today, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
      ushort currentYear = (ushort)today.Year;
      ushort previousWeek = (ushort)calendar.GetWeekOfYear(startOfPreviousWeek, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
      ushort previousYear = (ushort)startOfPreviousWeek.Year;
      if (previousWeek > currentWeek && previousYear == currentYear)
        previousYear--;

      return (currentWeek, currentYear, previousWeek, previousYear);
    }
    private Period? CreateNewPeriod(ushort week, ushort year)
    {
      var newPeriod = new Period
      {
        PeriodId = Guid.NewGuid().ToString(),
        Week = week,
        Year = year
      };

      return context.CreateEntity(newPeriod) ? newPeriod : null;
    }
    private List<Ticket> CopyTicketsFromPreviousPeriod(ushort previousWeek, ushort previousYear, Period newPeriod)
    {
      var tickets = GetTicketsByWeekAndYear(previousWeek, previousYear) ?? [];
      var newTickets = new List<Ticket>();
      foreach(var ticket in tickets)
      {
        var newTicket = CreateNewTicketFromExisting(ticket, newPeriod);
        if(context.CreateEntity(newTicket))
          newTickets.Add(newTicket);
      }

      return newTickets;
    }
    private Ticket CreateNewTicketFromExisting(Ticket ticket, Period newPeriod)
    {
      var newTicket = new Ticket
      {
        TicketId = Guid.NewGuid().ToString(),
        Serie = ticket.Serie,
        Bill = ticket.Bill,
        Employee = ticket.Employee,
        JobPosition = ticket.JobPosition,
        Department = ticket.Department,
        Total = ticket.Total,
        Projects = ticket.Projects,
        Observations = ticket.Observations,
        Company = ticket.Company,
        PayrollType = ticket.PayrollType,
        Status = ticket.Status,
        ReceiptOfDate = ticket.ReceiptOfDate,
        PaymentDate = ticket.PaymentDate,
        PeriodId = newPeriod.PeriodId,
        Period = newPeriod,
        TotalPerceptions = ticket.TotalPerceptions,
        TotalDeductions = ticket.TotalDeductions
      };

      CopyTicketPerceptions(ticket, newTicket);
      CopyTicketDeductions(ticket, newTicket);

      return newTicket;
    }
    private void CopyTicketPerceptions(Ticket ticket, Ticket newTicket)
    {
      foreach (var perception in ticket.TicketPerceptions)
      {
        if(perception.Name == "Sueldo" || perception.Name == "Hora Extra")
        {
          var newTicketPerception = new TicketPerception
          {
            TicketPerceptionId = Guid.NewGuid().ToString(),
            TicketId = newTicket.TicketId,
            PerceptionId = perception.PerceptionId,
            Name = perception.Name,
            Total = perception.Name == "Hora Extra" ? 0 : perception.Total,
            Ticket = newTicket,
            Perception = perception.Perception
          };

          newTicket.TicketPerceptions.Add(newTicketPerception);
          context.Add(newTicketPerception);
        }
      }
    }
    private void CopyTicketDeductions(Ticket ticket, Ticket newTicket)
    {
      foreach (var deduction in ticket.TicketDeductions)
      {
        var newTicketDeduction = new TicketDeduction
        {
          TicketDeductionId = Guid.NewGuid().ToString(),
          TicketId = newTicket.TicketId,
          DeductionId = deduction.DeductionId,
          Name = deduction.Name,
          Total = deduction.Total,
          Ticket = newTicket,
          Deduction = deduction.Deduction
        };

        newTicket.TicketDeductions.Add(newTicketDeduction);
        context.Add(newTicketDeduction);
      }
    }
    private static IQueryable<Ticket> IncludeRelatedEntities(IQueryable<Ticket> query) =>
      query
        .Include(t => t.TicketPerceptions)
          .ThenInclude(tp => tp.Perception)
        .Include(t => t.TicketDeductions)
          .ThenInclude(td => td.Deduction)
        .Include(t => t.Period);
  }
}