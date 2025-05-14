using System.ComponentModel.DataAnnotations;
using API.Enums;

namespace API.Models
{
  public class Company
  {
    [Key]
    [MaxLength(36)]
    public string CompanyId { get; set; } = default!;
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;
    public CompanyType CompanyType { get; set; }
    public ushort TotalWorkers { get; set; }
    public ICollection<Employee> Employees { get; set; } = [];
    public ICollection<Project> Projects { get; set; } = [];
  }
}