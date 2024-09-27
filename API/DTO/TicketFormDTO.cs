using API.Helpers;

namespace API.DTO
{
  public class TicketFormDTO
  {
    public string? TicketId { get; set; }
    public char Serie { get; set; }
    public ushort Bill { get; set; }
    public string Payroll { get; set; } = default!;
    public string Employee { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string ReceiptOfDate { get; set; } = default!;
    public string PaymentDate { get; set; } = default!;
    public HashSet<TicketPerceptionRelatedEntities> Perceptions { get; set; } = [];
    public HashSet<TicketDeductionRelatedEntities> Deductions { get; set; } = [];
    public string? Observations { get; set; }
  }
}