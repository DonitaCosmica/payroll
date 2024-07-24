using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IDeductionRepository
  {
    ICollection<Deduction> GetDeductions();
    Deduction GetDeduction(string deductionId);
    Deduction? GetDeductionByName(string deductionName);
    bool CreateDeduction(Deduction deduction);
    bool UpdateDeduction(Deduction deduction);
    bool DeleteDeduction(Deduction deduction);
    List<string> GetColumns();
    bool DeductionExists(string deductionId);
  }
}