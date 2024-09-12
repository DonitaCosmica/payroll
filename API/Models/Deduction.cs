using System.ComponentModel.DataAnnotations;
using API.Enums;

namespace API.Models
{
  public class Deduction
  {
    [Key]
    [MaxLength(36)]
    public string DeductionId { get; set; } = default!;
    [Required]
    [Range(1, ushort.MaxValue)]
    public ushort Key { get; set; }
    [Required]
    [MaxLength(75)]
    public string Description { get; set; } = default!;
    public bool IsHidden { get; set; }
    public ICollection<TicketDeduction> TicketDeductions { get; set; } = [];
  }
}