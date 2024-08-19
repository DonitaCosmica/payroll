namespace API.Helpers
{
  public class TicketList
  {
    public string? TicketId { get; set; }
    public char Serie { get; set; }
    public ushort Bill { get; set; }
    public string Employee { get; set; } = default!;
    public string? JobPosition { get; set; } = default!;
    public string? Department { get; set; } = default!;
    public HashSet<TicketPerceptionRelatedEntities> Perceptions { get; set; } = [];
    public HashSet<TicketDeductionRelatedEntities> Deductions { get; set; } = [];
    public string Status { get; set; } = default!;
    public float Total { get; set; }
    public string? Company { get; set; } = default!;
    public string? Projects { get; set; } = default!;
    public string? Observations { get; set; }
  }
}