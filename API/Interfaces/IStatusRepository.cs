using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IStatusRepository
  {
    ICollection<Status> GetStatuses();
    Status GetStatus(byte statusId);
    bool CreateStatus(Status status);
    bool UpdateStatus(Status status);
    bool DeleteStatus(Status status);
    bool StatusExists(byte statusId);
    bool Save();
  }
}