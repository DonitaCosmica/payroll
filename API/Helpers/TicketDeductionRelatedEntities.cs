namespace API.Helpers
{
  public class TicketDeductionRelatedEntities
  {
    public string? DeductionId { get; set; }
    public string? Name { get; set; } = default!;
    public float Value { get; set; }
  }
}