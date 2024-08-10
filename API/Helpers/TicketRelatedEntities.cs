using API.Models;

namespace API.Helpers
{
  public class TicketRelatedEntities
  {
    public Employee Employee { get; set; } = new();
    public JobPosition JobPosition { get; set; } = new();
    public Department Department { get; set; } = new();
    public Company Company { get; set; } = new();
    public Status Status { get; set; } = new();
    public Period Period { get; set; } = new();
  }
}