using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IBankRepository
  {
    ICollection<Bank> GetBanks();
    Bank GetBank(string bankId);
    bool CreateBank(Bank bank);
    bool UpdateBank(Bank bank);
    bool DeleteBank(Bank bank);
    List<string> GetColumns();
    bool BankExists(string bankId);
  }
}