using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
  public class EmployeeProject
  {
    [Key]
    [MaxLength(36)]
    public string EmployeeProjectId { get; set; } = default!;

    [Required]
    [MaxLength(36)]
    [ForeignKey("Employee")]
    
    public string EmployeeId { get; set; } = default!;

    [Required]
    [MaxLength(36)]
    [ForeignKey("Project")]
    public string ProjectId { get; set; } = default!;

    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    public DateTime AssignedDate { get; set;}

    public Employee Employee { get; set; } = new();

    public Project Project { get; set; } = new();
  }
}