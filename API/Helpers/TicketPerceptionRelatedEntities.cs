using API.Enums;

namespace API.Helpers
{
  public class TicketPerceptionRelatedEntities
  {
    public string PerceptionId { get; set; } = default!;
    public string? Name { get; set; } = default!;
    public float Value { get; set; }
    public string CompensationType { get; set; } = default!;
  }
}