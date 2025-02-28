using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class CommercialArea
  {
    [Key]
    [MaxLength(36)]
    public string CommercialAreaId { get; set; } = default!;
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;
    public ICollection<Employee> Employees { get; set; } = [];
  }
}