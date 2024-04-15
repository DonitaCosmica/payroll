using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Payroll.Models
{
  public class Status
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public byte StatusId { get; set; }

    [Required]
    [MaxLength(15)]
    public string Name { get; set; } = default!;

    public ICollection<Project> Projects { get; set; } = [];

    public ICollection<Employee> Employees { get; set; } = [];
  }
}