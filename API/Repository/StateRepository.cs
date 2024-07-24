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
    public State? GetStateByName(string stateName) => context.GetEntityByName<State>(stateName);
    public bool CreateState(State state) => context.CreateEntity(state);
    public bool UpdateState(State state) => context.UpdateEntity(state);
    public bool DeleteState(State state) => context.DeleteEntity(state);
    public bool StateExists(string stateId) => context.States.Any(s => s.StateId == stateId);
  }
}