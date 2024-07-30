using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
  public class Ticket
  {
    [Key]
    [MaxLength(36)]
    public string TicketId { get; set; } = default!;
    [Required]
    [RegularExpression(@"^N.{0,9}$", ErrorMessage = "The 'Bill' attribute must start with an 'N' and have a maximum length of 10 characters.")]
    public string Bill { get; set; } = default!;
    
    [Required]
    [MaxLength(36)]
    [ForeignKey("Employee")]
    public string EmployeeId { get; set; } = default!;
    public Employee Employee { get; set; } = new();
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
    [Required]
    [MaxLength(36)]
    [ForeignKey("Period")]
    public string PeriodId { get; set; } = default!;
    public Period Period { get; set; } = new();
  }
}