using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class Payroll
  {
    [Key]
    [MaxLength(36)]
    public string PayrollId { get; set; } = default!;
    [Required]
    public string Name { get; set; } = default!;
  }
}