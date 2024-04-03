using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Status
  {
    [Key]
    [MaxLength(36)]
    public string StatusId { get; set; } = default!;

    [Required]
    [MaxLength(15)]
    public string Name { get; set; } = default!;

    public Employee Employee { get; set; } = new();

    public Project Project { get; set; } = new();
  }
}