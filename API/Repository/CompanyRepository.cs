using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class CompanyRepository(DataContext context) : ICompanyRepository
  {
    private readonly DataContext context = context;

    public ICollection<Company> GetCompanies() => [.. context.Companies];
    public Company GetCompany(string companyId) => 
      context.Companies.Where(c => c.CompanyId == companyId).FirstOrDefault() ??
      throw new Exception("No Company with the specified id was found");
    public bool CreateCompany(Company company)
    {
      context.Add(company);
      return Save();
    }
    public bool UpdateCompany(Company company)
    {
      context.Update(company);
      return Save();
    }
    public bool DeleteCompany(Company company)
    {
      context.Remove(company);
      return Save();
    }
    public bool CompanyExists(string companyId) => context.Companies.Any(c => c.CompanyId == companyId);
    public bool Save()
    {
      var saved = context.SaveChanges();
      return saved > 0;
    }
  }
}