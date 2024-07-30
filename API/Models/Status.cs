using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class Status
  {
    [Key]
    [MaxLength(36)]
    public string StatusId { get; set; } = default!;

    [Required]
    [MaxLength(15)]
    public string Name { get; set; } = default!;

    public ICollection<Project> Projects { get; set; } = [];

    public ICollection<Employee> Employees { get; set; } = [];
  }
}