using API.Models;

namespace API.Interfaces
{
  public interface ICompanyRepository
  {
    ICollection<Company> GetCompanies();
    Company GetCompany(string companyId);
    Company? GetCompanyByName(string companyName);
    Company GetPrincipalCompany();
    Company GetCompanyByMatchPrefix(string prefix);
    bool CreateCompany(Company company);
    bool UpdateCompany(Company company);
    bool DeleteCompany(Company company);
    List<string> GetColumns();
    bool CompanyExists(string companyId);
  }
}