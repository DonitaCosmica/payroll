using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class BankRepository(DataContext context) : IBankRepository
  {
    private readonly DataContext context = context;
  
    public ICollection<Bank> GetBanks() => context.Banks.ToList();
    public Bank GetBank(string bankId) =>
      context.Banks.Where(b => b.BankId == bankId).FirstOrDefault() ?? 
      throw new Exception("No Bank with the specified id was found.");
    public bool CreateBank(Bank bank) => context.CreateEntity(bank);
    public bool UpdateBank(Bank bank) => context.UpdateEntity(bank);
    public bool DeleteBank(Bank bank) => context.DeleteEntity(bank);
    public List<string> GetColumns() => context.GetColumns<Bank>();
    public bool BankExists(string bankId) => context.Banks.Any(b => b.BankId == bankId);
  }
}