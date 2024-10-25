using API.Models;

namespace API.Interfaces
{
  public interface IAccountRepository
  {
    ICollection<Account> GetAccounts();
    Account GetAccount(string accountId);
    Account? GetAccountByName(string accountName);
    bool CreateAccount(Account account);
    bool UpdateAccount(Account account);
    bool DeleteAccount(Account account);
    List<string> GetColumns();
    bool AccountExists(string accountId);
  }
}