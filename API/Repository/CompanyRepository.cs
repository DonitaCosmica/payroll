using API.Data;
using API.Interfaces;
using API.Models;
using Common.Interfaces;
using Common.Models;

namespace API.Repository
{
  public class CompanyRepository(DataContext context) : ICompanyRepository, ICompanyLiteRepository
  {
    private readonly DataContext context = context;

    public ICollection<Company> GetCompanies() => [.. context.Companies];
    public Company GetCompany(string companyId) => 
      context.Companies.Where(c => c.CompanyId == companyId).FirstOrDefault() ??
      throw new Exception("No Company with the specified id was found");
    public Company? GetCompanyByName(string companyName) => context.GetEntityByName<Company>(companyName);
    public CompanyLite GetCompanyByMatchPrefix(string prefix)
    {
      string lowerPrefix = prefix.ToLower();
      Company? company = context.Companies
          .Where(c => c.Name.StartsWith(lowerPrefix, StringComparison.CurrentCultureIgnoreCase))
          .FirstOrDefault() ??
      throw new Exception("No Company with the specified id was found");;

      return new CompanyLite
      {
        CompanyId = company.CompanyId,
        Name = company.Name,
        TotalWorkers = company.TotalWorkers
      };
    }
    public bool CreateCompany(Company company) => context.CreateEntity(company);
    public bool UpdateCompany(Company company) => context.UpdateEntity(company);
    public bool DeleteCompany(Company company) => context.DeleteEntity(company);
    public List<string> GetColumns() => context.GetColumns<Company>();
    public bool CompanyExists(string companyId) => context.Companies.Any(c => c.CompanyId == companyId);
  }
}