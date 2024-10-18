using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class PerceptionRepository(DataContext context) : IPerceptionRepository
  {
    private readonly DataContext context = context;

    public ICollection<Perception> GetPerceptions()
    {
      void EnsurePerceptionExists(ushort key, string description)
      {
        if(!PerceptionExistsByName(description))
        {
          var perception = new Perception
          {
            PerceptionId = Guid.NewGuid().ToString(),
            Key = key,
            Description = description,
            IsHidden = false
          };

          if(!CreatePerception(perception))
            throw new InvalidOperationException($"Failed to create perception: {description}");
        }
      }

      EnsurePerceptionExists(1, "Sueldo");
      EnsurePerceptionExists(2, "Hora Extra");
      return [.. context.Perceptions];
    }
    public Perception GetPerception(string perceptionId) =>
      context.Perceptions.Where(p => p.PerceptionId == perceptionId).FirstOrDefault() ??
      throw new Exception("No Perception with the specified id was found");
    public Perception? GetPerceptionByName(string perceptionName) => context.GetEntityByName<Perception>(perceptionName);
    public bool CreatePerception(Perception perception) => context.CreateEntity(perception);
    public bool UpdatePerception(Perception perception) => context.UpdateEntity(perception);
    public bool DeletePerception(Perception perception) => context.DeleteEntity(perception);
    public List<string> GetColumns() => context.GetColumns<Perception>();
    public float GetBaseSalaryEmployee(string employeeId)
    {
      if(employeeId == null)
        throw new ArgumentNullException(nameof(employeeId), "Employee ID cannot be null.");

      var employee = context.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);
      return employee != null ? employee.BaseSalary : 0f;
    }
    public bool PerceptionExists(string perceptionId) =>
      context.Perceptions.Any(p => p.PerceptionId == perceptionId);
    public bool PerceptionExistsByName(string perceptionName) =>
      context.Perceptions.Any(p => p.Description == perceptionName);
  }
}