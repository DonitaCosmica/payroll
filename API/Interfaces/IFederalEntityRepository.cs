using API.Models;

namespace API.Interfaces
{
  public interface IFederalEntityRepository
  {
    ICollection<FederalEntity> GetFederalsEntities();
    FederalEntity GetFederalEntity(string federalEntityId);
    FederalEntity? GetFederalEntityByName(string federalEntityName);
    bool CreateFederalEntity(FederalEntity federalEntity);
    bool UpdateFederalEntity(FederalEntity federalEntity);
    bool DeleteFederalEntity(FederalEntity federalEntity);
    bool FederalEntityExists(string federalEntityId);
  }
}