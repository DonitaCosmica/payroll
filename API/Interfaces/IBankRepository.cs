using API.Models;

namespace API.Interfaces
{
  public interface IBankRepository
  {
    ICollection<Bank> GetBanks();
    Bank GetBank(string bankId);
    Bank? GetBankByName(string bankName);
    bool CreateBank(Bank bank);
    bool UpdateBank(Bank bank);
    bool DeleteBank(Bank bank);
    List<string> GetColumns();
    bool BankExists(string bankId);
  }
}