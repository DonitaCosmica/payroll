using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Department
  {
    [Key]
    [MaxLength(36)]
    public string DepartmentId { get; set; } = default!;

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = default!;
    
    [Required]
    public uint TotalEmployees { get; set; }
  }
}