using ERPAPI.Data;
using ERPAPI.Interfaces;
using Common.Models;

namespace ERPAPI.Repository;

public class BusinessUnitRepository(DataContext context) : IBusinessUnitRepository
{
  private readonly DataContext context = context;
  public ICollection<BusinessUnit> GetBusinessUnits() =>
    [.. context.BusinessUnits];
}