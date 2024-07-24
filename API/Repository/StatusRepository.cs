using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class StatusRepository(DataContext context) : IStatusRepository
  {
    private readonly DataContext context = context;

    public ICollection<Status> GetStatuses() => context.Statuses.ToList();
    public Status GetStatus(string statusId) => 
      context.Statuses.Where(s => s.StatusId == statusId).FirstOrDefault() ??
      throw new Exception("No Status with the specified id was found");
    public Status? GetStatusByName(string statusName) => context.GetEntityByName<Status>(statusName);
    public bool CreateStatus(Status status) => context.CreateEntity(status);
    public bool UpdateStatus(Status status) => context.UpdateEntity(status);
    public bool DeleteStatus(Status status) => context.DeleteEntity(status);
    public bool StatusExists(string statusId) => context.Statuses.Any(s => s.StatusId == statusId);
  }
}