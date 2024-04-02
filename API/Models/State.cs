using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class State
  {
    [Key]
    [MaxLength(36)]
    public string StateId { get; set; } = default!;

    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = default!;
    
    [Required]
    [MaxLength(6)]
    public string Abbreviation { get; set; } = default!;
  }
}