using System.ComponentModel.DataAnnotations;
using API.Enums;

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
    [Required]
    public StatusType StatusType { get; set; }
    public ICollection<Project> Projects { get; set; } = new HashSet<Project>();
    public ICollection<Employee> Employees { get; set; } = new HashSet<Employee>();
    public ICollection<Ticket> Tickets { get; set;} = [];
  }
}