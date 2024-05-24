using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IFederalEntityRepository
  {
    ICollection<FederalEntity> GetFederalsEntities();
    FederalEntity GetFederalEntity(string federalEntityId);
    bool CreateFederalEntity(FederalEntity federalEntity);
    bool UpdateFederalEntity(FederalEntity federalEntity);
    bool DeleteFederalEntity(FederalEntity federalEntity);
    bool FederalEntityExists(string federalEntityId);
  }
}