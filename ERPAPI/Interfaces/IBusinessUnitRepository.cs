using Common.Models;

namespace ERPAPI.Interfaces;

public interface IBusinessUnitRepository
{
  ICollection<BusinessUnit> GetBusinessUnits();
}