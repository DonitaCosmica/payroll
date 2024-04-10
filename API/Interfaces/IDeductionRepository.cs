using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IDeductionRepository
  {
    ICollection<Deduction> GetDeductions();
    Deduction GetDeduction(string deductionId);
    bool DeductionExists(string deductionId);
  }
}