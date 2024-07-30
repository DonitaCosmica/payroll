using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class PeriodRepository(DataContext context) : IPeriodRepository
  {
    private readonly DataContext context = context;

    public ICollection<Period> GetPeriods() => context.Periods.ToList();
    public Period GetPeriod(string periodId) => 
      context.Periods.FirstOrDefault(pr => pr.PeriodId == periodId)
      ?? throw new Exception("No Period with the specified id was found");
    public Period? GetPeriodByDate(DateTime start, DateTime end, ushort year) => 
      context.Periods.FirstOrDefault(pr => 
      DateTime.Compare(pr.StartDate, start) == 0 && 
      DateTime.Compare(pr.EndDate, end) == 0 && 
      pr.Year == year);
    public bool CreatePeriod(Period period) => context.CreateEntity(period);
    public bool UpdatePeriod(Period period) => context.UpdateEntity(period);
    public bool DeletePeriod(Period period) => context.DeleteEntity(period);
    public bool PeriodExists(string periodId) => 
      context.Periods.Any(pr => pr.PeriodId == periodId);
  }
}