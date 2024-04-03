using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class JobPosition
  {
    [Key]
    [MaxLength(36)]
    public string JobPositionId { get; set; } = default!;

    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = default!;

    public Department Department { get; set; } = new();
    
    public ICollection<Employee> Employees { get; set; } = [];
  }
}