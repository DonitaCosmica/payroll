using API.Data;
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
    public bool CreateCompany(Company company) => context.CreateEntity(company);
    public bool UpdateCompany(Company company) => context.UpdateEntity(company);
    public bool DeleteCompany(Company company) => context.DeleteEntity(company);
    public List<string> GetColumns() => context.GetColumns<Company>();
    public bool CompanyExists(string companyId) => context.Companies.Any(c => c.CompanyId == companyId);
  }
}