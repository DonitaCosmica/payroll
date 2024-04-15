using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface ICompanyRepository
  {
    ICollection<Company> GetCompanies();
    Company GetCompany(string companyId);
    bool CreateCompany(Company company);
    bool UpdateCompany(Company company);
    bool DeleteCompany(Company company);
    bool CompanyExists(string companyId);
    bool Save();
  }
}