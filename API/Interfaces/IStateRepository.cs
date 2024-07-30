using API.Models;

namespace API.Interfaces
{
  public interface IStateReporitory
  {
    ICollection<State> GetStates();
    State GetState(string stateId);
    State? GetStateByName(string stateName);
    bool CreateState(State state);
    bool UpdateState(State state);
    bool DeleteState(State state);
    bool StateExists(string stateId);
  }
}