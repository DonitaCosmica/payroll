using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IRegimeRepository
  {
    ICollection<Regime> GetRegimes();
    Regime GetRegime(string regimeId);
    bool CreateRegime(Regime regime);
    bool UpdateRegime(Regime regime);
    bool DeleteRegime(Regime regime);
    bool RegimeExists(string regimeId);
  }
}