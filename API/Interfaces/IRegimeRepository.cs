using API.Models;

namespace API.Interfaces
{
  public interface IRegimeRepository
  {
    ICollection<Regime> GetRegimes();
    Regime GetRegime(string regimeId);
    Regime? GetRegimeByName(string regimeName);
    bool CreateRegime(Regime regime);
    bool UpdateRegime(Regime regime);
    bool DeleteRegime(Regime regime);
    bool RegimeExists(string regimeId);
  }
}