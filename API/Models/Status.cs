using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Status
  {
    [Key]
    public byte StatusId { get; set; } = default!;

    [Required]
    [MaxLength(15)]
    public string Name { get; set; } = default!;

    public ICollection<Project> Projects { get; set; } = [];

    public ICollection<Employee> Employees { get; set; } = [];
  }
}