using Common.Models;

namespace Common.Interfaces;

public interface ICompanyLiteRepository
{
  CompanyLite GetCompanyByMatchPrefix(string prefix);
}