using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class TicketDeduction
  {
    [Key]
    [MaxLength(36)]
    public string TicketDeductionId { get; set; } = default!;
    [Required]
    [MaxLength(36)]
    public string TicketId { get; set; } = default!;
    [MaxLength(36)]
    public string? DeductionId { get; set; } // Nullable
    [Required]
    public string Name { get; set; } = default!;
    [Required]
    [Range(100, float.MaxValue)]
    public float Total { get; set; }
    public Ticket Ticket { get; set; } = new();
    public Deduction? Deduction { get; set; }
  }
}