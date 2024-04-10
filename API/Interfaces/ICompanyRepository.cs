using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface ICompanyRepository
  {
    ICollection<Company> GetCompanies();
    Company GetCompany(string companyId);
    bool CompanyExists(string companyId);
  }
}