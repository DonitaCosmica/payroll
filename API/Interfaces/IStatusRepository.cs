using API.Models;

namespace API.Interfaces
{
  public interface IStatusRepository
  {
    ICollection<Status> GetStatuses();
    Status GetStatus(string statusId);
    Status? GetStatusByName(string statusName);
    bool CreateStatus(Status status);
    bool UpdateStatus(Status status);
    bool DeleteStatus(Status status);
    bool StatusExists(string statusId);
  }
}