using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface ICommercialAreaRepository
  {
    ICollection<CommercialArea> GetCommercialAreas();
    CommercialArea GetCommercialArea(string commercialAreaId);
    bool CreateCommercialArea(CommercialArea commercialArea);
    bool UpdateCommercialArea(CommercialArea commercialArea);
    bool DeleteCommercialArea(CommercialArea commercialArea);
    bool CommercialAreaExists(string commercialAreaId);
    bool Save();
  }
}