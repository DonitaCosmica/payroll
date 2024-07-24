using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class RegimeRepository(DataContext context) : IRegimeRepository
  {
    private readonly DataContext context = context;

    public ICollection<Regime> GetRegimes() => context.Regimes.ToList();
    public Regime GetRegime(string regimeId) => 
      context.Regimes.Where(r => r.RegimeId == regimeId).FirstOrDefault() ?? 
      throw new Exception("No Regime with the specified id was found");
    public Regime? GetRegimeByName(string regimeName) => context.GetEntityByName<Regime>(regimeName);
    public bool CreateRegime(Regime regime) => context.CreateEntity(regime);
    public bool UpdateRegime(Regime regime) => context.UpdateEntity(regime);
    public bool DeleteRegime(Regime regime) => context.DeleteEntity(regime);
    public bool RegimeExists(string regimeId) => context.Regimes.Any(r => r.RegimeId == regimeId);
  }
}