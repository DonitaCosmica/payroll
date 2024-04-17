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
    public bool CreateDeduction(Deduction deduction)
    {
      context.Add(deduction);
      return Save();
    }
    public bool UpdateDeduction(Deduction deduction)
    {
      context.Update(deduction);
      return Save();
    }
    public bool DeleteDeduction(Deduction deduction)
    {
      context.Remove(deduction);
      return Save();
    }
    public bool DeductionExists(string deductionId) => context.Deductions.Any(d => d.DeductionId == deductionId);
    public bool Save() => context.SaveChanges() > 0;
  }
}