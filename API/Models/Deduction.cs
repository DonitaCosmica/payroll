using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Deduction
  {
    [Key]
    [MaxLength(36)]
    public string DeductionId { get; set; } = default!;
  }
}