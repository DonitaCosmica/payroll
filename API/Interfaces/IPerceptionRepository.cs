using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IPerceptionRepository
  {
    ICollection<Perception> GetPerceptions();
    Perception GetPerception(string perceptionId);
    bool CreatePerception(Perception perception);
    bool UpdatePerception(Perception perception);
    bool DeletePerception(Perception perception);
    List<string> GetColumns();
    bool PerceptionExists(string perceptionId);
  }
}