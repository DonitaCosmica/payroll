using API.Enums;
using API.Models;

namespace API.Interfaces
{
  public interface IStatusRepository
  {
    ICollection<Status> GetStatuses();
    ICollection<Status> GetStatusesByType(StatusType type);
    Status GetStatus(string statusId);
    Status? GetStatusByName(string statusName);
    bool CreateStatus(Status status);
    bool UpdateStatus(Status status);
    bool DeleteStatus(Status status);
    bool StatusExists(string statusId);
  }
}