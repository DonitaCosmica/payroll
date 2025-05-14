using ERPAPI.Data;
using ERPAPI.Interfaces;
using ERPAPI.Models;

namespace ERPAPI.Repository;

public class BusinessUnitRepository(DataContext context) : IBusinessUnitRepository
{
  private readonly DataContext context = context;
  public ICollection<BusinessUnit> GetBusinessUnits() =>
    [.. context.BusinessUnits];
}