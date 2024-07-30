using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class PerceptionRepository(DataContext context) : IPerceptionRepository
  {
    private readonly DataContext context = context;

    public ICollection<Perception> GetPerceptions() => context.Perceptions.ToList();
    public Perception GetPerception(string perceptionId) =>
      context.Perceptions.Where(p => p.PerceptionId == perceptionId).FirstOrDefault() ??
      throw new Exception("No Perception with the specified id was found");
    public Perception? GetPerceptionByName(string perceptionName) => context.GetEntityByName<Perception>(perceptionName);
    public bool CreatePerception(Perception perception) => context.CreateEntity(perception);
    public bool UpdatePerception(Perception perception) => context.UpdateEntity(perception);
    public bool DeletePerception(Perception perception) => context.DeleteEntity(perception);
    public List<string> GetColumns() => context.GetColumns<Perception>();
    public bool PerceptionExists(string perceptionId) => context.Perceptions.Any(p => p.PerceptionId == perceptionId);
  }
}