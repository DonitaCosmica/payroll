using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Perception
  {
    [Key]
    [MaxLength(36)]
    public string PerceptionId { get; set; } = default!;

    [Required]
    public ushort Key { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = default!;

    public bool IsHidden { get; set; }
  }
}