using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class DeductionRepository(DataContext context) : IDeductionRepository
  {
    private readonly DataContext context = context;

    public ICollection<Deduction> GetDeductions() => context.Deductions.ToList();
    public Deduction GetDeduction(string deductionId) =>
      context.Deductions.Where(d => d.DeductionId == deductionId).FirstOrDefault() ??
      throw new Exception("No Deduction with the specified id was found");
    public Deduction? GetDeductionByName(string deductionName) => context.GetEntityByName<Deduction>(deductionName);
    public bool CreateDeduction(Deduction deduction) => context.CreateEntity(deduction);
    public bool UpdateDeduction(Deduction deduction) => context.UpdateEntity(deduction);
    public bool DeleteDeduction(Deduction deduction) => context.DeleteEntity(deduction);
    public List<string> GetColumns() => context.GetColumns<Deduction>();
    public bool DeductionExists(string deductionId) => context.Deductions.Any(d => d.DeductionId == deductionId);
  }
}