using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class StateRepository(DataContext context) : IStateReporitory
  {
    private readonly DataContext context = context;

    public ICollection<State> GetStates() => context.States.ToList();
    public State GetState(string stateId) =>
      context.States.Where(s => s.StateId == stateId).FirstOrDefault() ??
      throw new Exception("No State with the specified id was found");
    public bool CreateState(State state)
    {
      context.Add(state);
      return Save();
    }
    public bool UpdateState(State state)
    {
      context.Update(state);
      return Save();
    }
    public bool DeleteState(State state)
    {
      context.Remove(state);
      return Save();
    }
    public bool StateExists(string stateId) => context.States.Any(s => s.StateId == stateId);
    public bool Save() => context.SaveChanges() > 0;
  }
}