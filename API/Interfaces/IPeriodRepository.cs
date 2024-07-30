using API.Models;

namespace API.Interfaces
{
  public interface IPeriodRepository
  {
    ICollection<Period> GetPeriods();
    Period GetPeriod(string periodId);
    Period? GetPeriodByDate(DateTime start, DateTime end, ushort year);
    bool CreatePeriod(Period period);
    bool UpdatePeriod(Period period);
    bool DeletePeriod(Period period);
    bool PeriodExists(string periodId);
  }
}