using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IStateReporitory
  {
    ICollection<State> GetStates();
    State GetState(ushort stateId);
    bool CreateState(State state);
    bool UpdateState(State state);
    bool DeleteState(State state);
    bool StateExists(ushort stateId);
    bool Save();
  }
}