namespace API.DTO
{
  public class TicketDTO
  {
    public string? TicketId { get; set; }
    public string Bill { get; set; } = default!;
    public string Employee { get; set; } = default!;
    public string JobPosition { get; set; } = default!;
    public float DailySalary { get; set; }
    public ushort ExtraHours { get; set; }
    public float ValuePerExtraHour { get; set; }
    public ushort ExtraTime { get; set; }
    public float TravelExpenses { get; set; }
    public ushort Tickets { get; set; }
    public float Discount { get; set; }
    public ushort Faults { get; set; }
    public float MissingDiscount { get; set; }
    public float LoanDiscount { get; set; }
    public float Total { get; set; }
    public string? Observations { get; set; }
    public string Project { get; set; } = default!;
    public string PayrollType { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string Period { get; set; } = default!;
  }
}