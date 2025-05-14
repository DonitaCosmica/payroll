using API.Data;
using API.Enums;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class CompanyRepository(DataContext context) : ICompanyRepository
  {
    private readonly DataContext context = context;

    public ICollection<Company> GetCompanies() => [.. context.Companies];
    public Company GetCompany(string companyId) => 
      context.Companies.Where(c => c.CompanyId == companyId).FirstOrDefault() ??
      throw new Exception("No Company with the specified id was found");
    public Company? GetCompanyByName(string companyName) => context.GetEntityByName<Company>(companyName);
    public Company GetPrincipalCompany() =>
      context.Companies.Where(c => c.CompanyType == CompanyType.Parent).FirstOrDefault() ??
      throw new Exception("No Company with the specified id was found");
    public Company GetCompanyByMatchPrefix(string prefix)
    {
      string lowerPrefix = prefix.ToLower();
      if(lowerPrefix == "xxx") lowerPrefix = "ccc";
      if(lowerPrefix == "var") lowerPrefix = "tam";

      return context.Companies
        .AsEnumerable()
        .Where(c => c.Name.StartsWith(lowerPrefix, StringComparison.CurrentCultureIgnoreCase) && c.CompanyType == CompanyType.Child)
        .FirstOrDefault() ??
        throw new Exception("No Company with the specified id was found");
    }
    public bool CreateCompany(Company company)
    {
      company.CompanyType = (GetCompanies().Count == 0) ? CompanyType.Parent : CompanyType.Child;
      return context.CreateEntity(company);
    }
    public bool UpdateCompany(Company company) => context.UpdateEntity(company);
    public bool DeleteCompany(Company company) => context.DeleteEntity(company);
    public List<string> GetColumns() => context.GetColumns<Company>();
    public bool CompanyExists(string companyId) => context.Companies.Any(c => c.CompanyId == companyId);
  }
}