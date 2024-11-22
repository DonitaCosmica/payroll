using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class DeductionRepository(DataContext context) : IDeductionRepository
  {
    private readonly DataContext context = context;

    public ICollection<Deduction> GetDeductions()
    {
      void EnsureDeductionExists(ushort key, string description)
      {
        if(!DeductionExistsByName(description))
        {
          var deduction = new Deduction
          {
            DeductionId = Guid.NewGuid().ToString(),
            Key = key,
            Description = description,
            IsHidden = false
          };

          if(!CreateDeduction(deduction))
            throw new InvalidOperationException($"Failed to create perception: { description }");
        }
      }

      EnsureDeductionExists(1, "Desc. x Prestamos");
      return [.. context.Deductions];
    }
    public Deduction GetDeduction(string deductionId) =>
      context.Deductions.Where(d => d.DeductionId == deductionId).FirstOrDefault() ??
      throw new Exception("No Deduction with the specified id was found");
    public Deduction? GetDeductionByName(string deductionName) => context.GetEntityByName<Deduction>(deductionName);
    public bool CreateDeduction(Deduction deduction) => context.CreateEntity(deduction);
    public bool UpdateDeduction(Deduction deduction) => context.UpdateEntity(deduction);
    public bool DeleteDeduction(Deduction deduction) => context.DeleteEntity(deduction);
    public List<string> GetColumns() => context.GetColumns<Deduction>();
    public bool DeductionExists(string deductionId) => context.Deductions.Any(d => d.DeductionId == deductionId);
    private bool DeductionExistsByName(string deductionName) =>
      context.Deductions.Any(d => d.Description == deductionName);
  }
}