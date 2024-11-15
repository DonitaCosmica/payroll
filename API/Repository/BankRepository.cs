using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class BankRepository(DataContext context) : IBankRepository
  {
    private readonly DataContext context = context;
  
    public ICollection<Bank> GetBanks() => context.Banks.ToList();
    public Bank GetBank(string bankId) =>
      context.Banks.FirstOrDefault(b => b.BankId == bankId) ?? 
      throw new Exception("No Bank with the specified id was found.");
    public Bank? GetBankByName(string bankName) => context.GetEntityByName<Bank>(bankName);
    public Bank? GetBankByCode(string bankCode) => context.Banks.FirstOrDefault(b => b.Code == bankCode);
    public bool CreateBank(Bank bank) => context.CreateEntity(bank);
    public bool UpdateBank(Bank bank) => context.UpdateEntity(bank);
    public bool DeleteBank(Bank bank) => context.DeleteEntity(bank);
    public List<string> GetColumns() => context.GetColumns<Bank>();
    public bool BankExists(string bankId) => context.Banks.Any(b => b.BankId == bankId);
  }
}