using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class FederalEntityRepository(DataContext context) : IFederalEntityRepository
  {
    private readonly DataContext context = context;

    public ICollection<FederalEntity> GetFederalsEntities() => context.FederalEntities.ToList();
    public FederalEntity GetFederalEntity(string federalEntityId) => 
      context.FederalEntities.Where(fe => fe.FederalEntityId == federalEntityId).FirstOrDefault() ?? 
      throw new Exception("No Federal Entity with the specified id was found");
    public bool CreateFederalEntity(FederalEntity federalEntity) => context.CreateEntity(federalEntity);
    public bool UpdateFederalEntity(FederalEntity federalEntity) => context.UpdateEntity(federalEntity);
    public bool DeleteFederalEntity(FederalEntity federalEntity) => context.DeleteEntity(federalEntity);
    public bool FederalEntityExists(string federalEntityId) => context.FederalEntities.Any(fe => fe.FederalEntityId == federalEntityId);
  }
}