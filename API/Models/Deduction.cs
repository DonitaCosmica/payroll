using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class Deduction
  {
    [Key]
    [MaxLength(36)]
    public string DeductionId { get; set; } = default!;
    [Required]
    [MaxLength(3)]
    public string Key { get; set; } = default!;
    [Required]
    [MaxLength(125)]
    public string Description { get; set; } = default!;
    public bool IsHidden { get; set; }
    public ICollection<TicketDeduction> TicketDeductions { get; set; } = [];
  }
}