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
    [MaxLength(30)]
    public string Name { get; set; } = default!;
    [Required]
    public StatusType StatusType { get; set; }
    [Required]
    public StatusOption StatusOption { get; set; }
    [Required]
    public StatusCode StatusCode { get; set; }
    public ICollection<Project> Projects { get; set; } = new HashSet<Project>();
    public ICollection<Employee> Employees { get; set; } = new HashSet<Employee>();
  }
}