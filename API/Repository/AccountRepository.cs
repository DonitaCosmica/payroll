using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class AccountRepository(DataContext context) : IAccountRepository
  {
    private readonly DataContext context = context;

    public ICollection<Account> GetAccounts() => [.. context.Accounts];
    public Account GetAccount(string accountId) =>
      context.Accounts.FirstOrDefault(a => a.AccountId == accountId) ??
      throw new Exception("No Account with the specified id was found");
    public Account? GetAccountByName(string accountName) => context.GetEntityByName<Account>(accountName);
    public bool CreateAccount(Account account) => context.CreateEntity(account);
    public bool UpdateAccount(Account account) => context.UpdateEntity(account);
    public bool DeleteAccount(Account account) => context.DeleteEntity(account);
    public List<string> GetColumns() => context.GetColumns<Account>();
    public bool AccountExists(string accountId) => context.Accounts.Any(a => a.AccountId == accountId);
  }
}