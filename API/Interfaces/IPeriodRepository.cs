using API.Models;

namespace API.Interfaces
{
  public interface IPeriodRepository
  {
    ICollection<Period> GetPeriods();
    List<ushort> GetYears();
    Period GetPeriod(string periodId);
    Period? GetPeriodByWeekYear(ushort PeriodNumber, ushort year);
    bool CreatePeriod(Period period);
    bool UpdatePeriod(Period period);
    bool DeletePeriod(Period period);
    bool PeriodExists(string periodId);
  }
}