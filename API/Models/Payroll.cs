using System.ComponentModel.DataAnnotations;
using API.Enums;

namespace API.Models
{
  public class Payroll
  {
    [Key]
    [MaxLength(36)]
    public string PayrollId { get; set; } = default!;
    [Required]
    public string Name { get; set; } = default!;
    [Required]
    public PayrollType PayrollType { get; set; }
  }
}