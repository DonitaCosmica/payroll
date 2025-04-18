using System.Globalization;
using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
  public class TableWorkRepository(DataContext context) : ITableWorkRepository
  {
    private readonly DataContext context = context;

    public ICollection<TableWork> GetTableWorks()
    {
      var (currentWeek, currentYear) = GetWeekAndYearInfo();
      var principalPayroll = context.Payrolls.FirstOrDefault(pr => pr.PayrollType == Enums.PayrollType.Principal)
        ?? throw new InvalidOperationException("No se encontró una nómina principal.");

      CreateNewTableWorkFromTickets(currentWeek, currentYear);
      return [.. IncludeRelatedEntities(context.TableWorks)
        .Where(tw => tw.Ticket.Period.Week == currentWeek &&
          tw.Ticket.Period.Year == currentYear && tw.Ticket.PayrollType == principalPayroll.Name)];
    }
    public TableWork GetTableWork(string tableWorkId) =>
      IncludeRelatedEntities(context.TableWorks).FirstOrDefault(tw => tw.TableWorkId == tableWorkId) ??
      throw new Exception("No Table Work with the specified was found");
    public Ticket GetRelatedTicket(string ticketId) =>
      context.Tickets.FirstOrDefault(t => ticketId == t.TicketId) ??
      throw new Exception("No Table Work with the specified was found");
    public bool CreateTableWork(TableWork tableWork) => context.CreateEntity(tableWork);
    public bool UpdateTableWork(TableWork tableWork) => context.UpdateEntity(tableWork);
    public bool DeleteTableWork(TableWork tableWork) => context.DeleteEntity(tableWork);
    public List<string> GetColumns() => context.GetColumns<TableWork>();
    public void GetColumnsFromRelatedEntity<T>(T tableWork, List<string> columns) where T : class =>
      context.GetColumns(tableWork, columns);
    public bool TableWorkExists(string tableWorkId) => context.TableWorks.Any(tw => tw.TableWorkId == tableWorkId);
    private static (ushort currentWeek, ushort currentYear) GetWeekAndYearInfo()
    {
      DateTime today = DateTime.Now;
      CultureInfo culture = new("es-MX");
      Calendar calendar = culture.Calendar;

      ushort currentWeek = (ushort)calendar.GetWeekOfYear(today, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
      ushort currentYear = (ushort)today.Year;

      return (currentWeek, currentYear);
    }
    private void CreateNewTableWorkFromTickets(ushort currentWeek, ushort currentYear)
    {
      var tickets = context.Tickets.Include(t => t.Period).Where(
        t => t.Period.Week == currentWeek && t.Period.Year == currentYear).ToList();

      var newTableWorks = new List<TableWork>();
      foreach(var ticket in tickets)
      {
        var tableWorkExists = context.TableWorks.Any(tw => tw.TicketId == ticket.TicketId);
        if(!tableWorkExists)
        {
          var newTableWork = new TableWork
          {
            TableWorkId = Guid.NewGuid().ToString(),
            TicketId = ticket.TicketId,
            Ticket = ticket,
            StsTr = 'A',
            StsR = 'A',
            Cta = Enums.CtaOptions.Si,
            Observations = ticket.Observations ?? "Sin Observaciones",
            Monday = 0,
            Tuesday = 0,
            Wednesday = 0,
            Thursday = 0,
            Friday = 0,
            Saturday = 0,
            Sunday = 0
          };

          newTableWorks.Add(newTableWork);
        }
      }

      if(newTableWorks.Count != 0)
      {
        context.TableWorks.AddRange(newTableWorks);
        context.SaveChanges();
      }
    }
    private static IQueryable<TableWork> IncludeRelatedEntities(IQueryable<TableWork> query) =>
      query
        .Include(tw => tw.Ticket)
          .ThenInclude(t => t.Period)
        .Include(tw => tw.Ticket)
          .ThenInclude(t => t.TicketPerceptions)
            .ThenInclude(tp => tp.Perception)
        .Include(tw => tw.Ticket)
          .ThenInclude(t => t.TicketDeductions)
            .ThenInclude(td => td.Deduction);
  }
}