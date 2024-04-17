using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class PerceptionRepository(DataContext context) : IPerceptionRepository
  {
    private readonly DataContext context = context;

    public ICollection<Perception> GetPerceptions() => context.Perceptions.ToList();
    public Perception GetPerception(string perceptionId) =>
      context.Perceptions.Where(p => p.PerceptionId == perceptionId).FirstOrDefault() ??
      throw new Exception("No Perception with the specified id was found");
    public bool CreatePerception(Perception perception)
    {
      context.Add(perception);
      return Save();
    }
    public bool UpdatePerception(Perception perception)
    {
      context.Update(perception);
      return Save();
    }
    public bool DeletePerception(Perception perception)
    {
      context.Remove(perception);
      return Save();
    }
    public bool PerceptionExists(string perceptionId) => context.Perceptions.Any(p => p.PerceptionId == perceptionId);
    public bool Save()
    {
      var saved = context.SaveChanges();
      return saved > 0;
    }
  }
}