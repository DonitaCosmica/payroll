using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class State
  {
    [Key]
    public ushort StateId { get; set; } = default!;

    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = default!;

    [Required]
    [MaxLength(6)]
    public string Abbreviation { get; set; } = default!;

    public ICollection<Employee> Employees { get; set; } = [];
  }
}