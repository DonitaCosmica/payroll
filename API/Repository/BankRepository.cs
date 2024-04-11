using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class BankRepository(DataContext context) : IBankRepository
  {
    private readonly DataContext context = context;
  
    public ICollection<Bank> GetBanks() => context.Banks.ToList();
    public Bank GetBank(byte bankId) =>
      context.Banks.Where(b => b.BankId == bankId).FirstOrDefault() ?? 
      throw new Exception("No Bank with the specified id was found.");
    public bool CreateBank(Bank bank)
    {
      context.Add(bank);
      return Save();
    }
    public bool BankExists(byte bankId) => context.Banks.Any(b => b.BankId == bankId);
    public bool Save()
    {
      var saved = context.SaveChanges();
      return saved > 0;
    }
  }
}