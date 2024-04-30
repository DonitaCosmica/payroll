using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IStateReporitory
  {
    ICollection<State> GetStates();
    State GetState(string stateId);
    bool CreateState(State state);
    bool UpdateState(State state);
    bool DeleteState(State state);
    bool StateExists(string stateId);
    bool Save();
  }
}