using System.Globalization;
using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class PeriodRepository(DataContext context) : IPeriodRepository
  {
    private readonly DataContext context = context;

    public ICollection<Period> GetPeriods() => context.Periods.ToList();
    public List<ushort> GetYears() => 
      context.Periods.Select(pr => pr.Year).Distinct().ToList();
    public Period GetPeriod(string periodId) => 
      context.Periods.FirstOrDefault(pr => pr.PeriodId == periodId)
      ?? throw new Exception("No Period with the specified id was found");
    public Period? GetPeriodByWeekYear(ushort PeriodNumber, ushort year) => 
      context.Periods.FirstOrDefault(pr => 
      pr.Week == PeriodNumber && 
      pr.Year == year);
    public bool CreatePeriod(Period period) => context.CreateEntity(period);
    public bool UpdatePeriod(Period period) => context.UpdateEntity(period);
    public bool DeletePeriod(Period period) => context.DeleteEntity(period);
    public bool PeriodExists(string periodId) => 
      context.Periods.Any(pr => pr.PeriodId == periodId);
  }
}