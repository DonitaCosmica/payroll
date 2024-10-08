using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class CommercialAreaRepository(DataContext context) : ICommercialAreaRepository
  {
    private readonly DataContext context = context;

    public ICollection<CommercialArea> GetCommercialAreas() => context.CommercialAreas.ToList();
    public CommercialArea GetCommercialArea(string commercialAreaId) => 
      context.CommercialAreas.Where(ca => ca.CommercialAreaId == commercialAreaId).FirstOrDefault() ??
      throw new Exception("No Commercial Area with the specified id was found");
    public CommercialArea? GetCommercialAreaByName(string commercialAreaName) => context.GetEntityByName<CommercialArea>(commercialAreaName);
    public bool CreateCommercialArea(CommercialArea commercialArea) => context.CreateEntity(commercialArea);
    public bool UpdateCommercialArea(CommercialArea commercialArea) => context.UpdateEntity(commercialArea);
    public bool DeleteCommercialArea(CommercialArea commercialArea) => context.DeleteEntity(commercialArea);
    public List<string> GetColumns() => context.GetColumns<CommercialArea>();
    public bool CommercialAreaExists(string commercialAreaId) => 
      context.CommercialAreas.Any(ca => ca.CommercialAreaId == commercialAreaId);
  }
}