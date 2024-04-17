using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class CommercialAreaRepository(DataContext context) : ICommercialAreaRepository
  {
    private readonly DataContext context = context;

    public ICollection<CommercialArea> GetCommercialAreas() => context.CommercialAreas.ToList();
    public CommercialArea GetCommercialArea(string commercialAreaId) => 
      context.CommercialAreas.Where(ca => ca.CommercialAreaId == commercialAreaId).FirstOrDefault() ??
      throw new Exception("No Commercial Area with the specified id was found");
    public bool CommercialAreaExists(string commercialAreaId) => 
      context.CommercialAreas.Any(ca => ca.CommercialAreaId == commercialAreaId);
    public bool CreateCommercialArea(CommercialArea commercialArea)
    {
      context.Add(commercialArea);
      return Save();
    }
    public bool UpdateCommercialArea(CommercialArea commercialArea)
    {
      context.Update(commercialArea);
      return Save();
    }
    public bool DeleteCommercialArea(CommercialArea commercialArea)
    {
      context.Remove(commercialArea);
      return Save();
    }
    public bool Save() => context.SaveChanges() > 0;
  }
}