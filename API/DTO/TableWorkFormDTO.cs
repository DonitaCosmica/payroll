using API.Helpers;

namespace API.DTO
{
  public class TableWorkFormDTO
  {
    public string TableWorkId { get; set; } = default!;
    public string Ticket { get; set; } = default!;
    public string? Employee { get; set; }
    public char StsTr { get; set; }
    public char StsR { get; set; }
    public string Cta { get; set; } = default!;
    public HashSet<TicketPerceptionRelatedEntities> Perceptions { get; set; } = [];
    public HashSet<TicketDeductionRelatedEntities> Deductions { get; set; } = [];
    public float Total { get; set; }
    public string? Observations { get; set; }
    public float Monday { get; set; }
    public float Tuesday { get; set; }
    public float Wednesday { get; set; }
    public float Thursday { get; set; }
    public float Friday { get; set; }
    public float Saturday { get; set; }
    public float Sunday { get; set; }
  }
}