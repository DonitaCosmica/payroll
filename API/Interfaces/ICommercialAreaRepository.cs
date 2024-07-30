using API.Models;

namespace API.Interfaces
{
  public interface ICommercialAreaRepository
  {
    ICollection<CommercialArea> GetCommercialAreas();
    CommercialArea GetCommercialArea(string commercialAreaId);
    CommercialArea? GetCommercialAreaByName(string commercialAreaName);
    bool CreateCommercialArea(CommercialArea commercialArea);
    bool UpdateCommercialArea(CommercialArea commercialArea);
    bool DeleteCommercialArea(CommercialArea commercialArea);
    List<string> GetColumns();
    bool CommercialAreaExists(string commercialAreaId);
  }
}