using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class State
  {
    [Key]
    [MaxLength(36)]
    public string StateId { get; set; } = default!;

    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = default!;

    [Required]
    [MaxLength(6)]
    public string Abbreviation { get; set; } = default!;

    public ICollection<Employee> Employees { get; set; } = [];
  }
}