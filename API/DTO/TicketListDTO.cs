using API.Helpers;

namespace API.DTO
{
  public class TicketListDTO
  {
    public string? TicketId { get; set; }
    public char Serie { get; set; }
    public ushort Bill { get; set; }
    public string Employee { get; set; } = default!;
    public string? JobPosition { get; set; } = default!;
    public string? Department { get; set; } = default!;
    public Dictionary<string, object> AdditionalProperties { get; set; } = [];
    public string Status { get; set; } = default!;
    public float Total { get; set; }
    public string? Company { get; set; } = default!;
    public string? Projects { get; set; } = default!;
    public string? Observations { get; set; }
  }
}