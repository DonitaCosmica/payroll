using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface ICommercialAreaRepository
  {
    ICollection<CommercialArea> GetCommercialAreas();
    CommercialArea GetCommercialArea(string commercialAreaId);
    bool CommercialAreaExists(string commercialAreaId);
  }
}