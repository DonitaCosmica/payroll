using System.ComponentModel.DataAnnotations;

namespace API.Models
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
    public ushort TotalEmployees { get; set; }
    public bool SubContract { get; set; }
    public ICollection<JobPosition> JobPositions { get; set; } = [];
  }
}