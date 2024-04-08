using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Payroll.Models
{
  public class Project
  {
    [Key]
    [MaxLength(36)]
    public string ProjectId { get; set; } = default!;

    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = default!;

    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = default!;

    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    [Range(typeof(DateTime), "01-01-1900", "31-12-3000")]
    [RegularExpression(@"pattern")]
    public DateTime StartDate { get; set; }

    [Required]
    [ForeignKey("Status")]
    public byte StatusId { get; set; }

    public Status Status { get; set; } = new();

    public ICollection<EmployeeProject> EmployeeProjects { get; set; } = [];
  }
}