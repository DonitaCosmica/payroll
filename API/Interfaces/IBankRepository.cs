using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IBankRepository
  {
    ICollection<Bank> GetBanks();
    Bank GetBank(byte bankId);
    bool CreateBank(Bank bank);
    bool UpdateBank(Bank bank);
    bool DeleteBank(Bank bank);
    bool BankExists(byte bankId);
    bool Save();
  }
}