using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class StatusRepository(DataContext context) : IStatusRepository
  {
    private readonly DataContext context = context;

    public ICollection<Status> GetStatuses() => context.Statuses.ToList();
    public Status GetStatus(byte statusId) => 
      context.Statuses.Where(s => s.StatusId == statusId).FirstOrDefault() ??
      throw new Exception("No Status with the specified id was found");
    public bool CreateStatus(Status status)
    {
      context.Add(status);
      return Save();
    }
    public bool UpdateStatus(Status status)
    {
      context.Update(status);
      return Save();
    }
    public bool DeleteStatus(Status status)
    {
      context.Remove(status);
      return Save();
    }
    public bool StatusExists(byte statusId) => context.Statuses.Any(s => s.StatusId == statusId);
    public bool Save() => context.SaveChanges() > 0;
  }
}