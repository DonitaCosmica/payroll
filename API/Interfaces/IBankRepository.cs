using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IBankRepository
  {
    ICollection<Bank> GetBanks();
    Bank GetBank(byte bankId);
    bool BankExists(byte bankId);
  }
}