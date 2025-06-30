using API.Data;
using API.Enums;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class StatusRepository(DataContext context) : IStatusRepository
  {
    private readonly DataContext context = context;

    public ICollection<Status> GetStatuses() => [.. context.Statuses];
    public ICollection<Status> GetStatusesByType(StatusType type) =>
      [.. context.Statuses.Where(s => s.StatusType == type)];
    public Status GetStatus(string statusId) => 
      context.Statuses.Where(s => s.StatusId == statusId).FirstOrDefault() ??
      throw new Exception("No Status with the specified id was found");
    public Status? GetStatusByName(string statusName, StatusType statusType) =>
      context.Statuses.FirstOrDefault(s => s.Name == statusName && s.StatusType == statusType);
    public Status GetStatusByStatusOption(StatusOption option) =>
      context.Statuses.FirstOrDefault(s => s.StatusOption == option) ??
      throw new Exception("No Status with the specified status option was found");
    public Status GetStatusByStatusCode(StatusCode statusCode) =>
      context.Statuses.FirstOrDefault(s => s.StatusCode == statusCode) ??
      throw new Exception("No Status with the specified status code was found");
    public bool CreateStatus(Status status) => context.CreateEntity(status);
    public bool UpdateStatus(Status status) => context.UpdateEntity(status);
    public bool DeleteStatus(Status status) => context.DeleteEntity(status);
    public bool StatusExists(string statusId) => context.Statuses.Any(s => s.StatusId == statusId);
  }
}