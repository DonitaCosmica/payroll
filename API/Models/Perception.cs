using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Perception
  {
    [Key]
    [MaxLength(36)]
    public string PerceptionId { get; set; } = default!;
  }
}