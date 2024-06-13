using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Company
  {
    [Key]
    [MaxLength(36)]
    public string CompanyId { get; set; } = default!;
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = default!;
    public ushort TotalWorkers { get; set; }
    public ICollection<Employee> Employees { get; set; } = [];
    public ICollection<Project> Projects { get; set; } = [];
  }
}