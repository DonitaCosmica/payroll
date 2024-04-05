using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    [Required]
    [MaxLength(36)]
    [ForeignKey("Department")]
    public string DepartmentId { get; set; } = default!;

    public Department Department { get; set; } = new();
    
    public ICollection<Employee> Employees { get; set; } = [];
  }
}