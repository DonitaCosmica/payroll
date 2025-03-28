using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
  public class Project
  {
    [Key]
    [MaxLength(36)]
    public string ProjectId { get; set; } = default!;
    [Required]
    [MaxLength(30)]
    public string Code { get; set; } = default!;
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;
    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    [Range(typeof(DateTime), "01-01-1900", "31-12-3000")]
    [RegularExpression(@"pattern")]
    public DateTime StartDate { get; set; }
    [Required]
    [MaxLength(36)]
    [ForeignKey("Status")]
    public string StatusId { get; set; } = default!;
    public Status Status { get; set; } = new();
    [Required]
    [MaxLength(36)]
    [ForeignKey("Company")]
    public string CompanyId { get; set; } = default!;
    public Company Company { get; set; } = new();
    [MaxLength(100)]
    public string Description { get; set; } = default!;
    public ICollection<EmployeeProject> EmployeeProjects { get; set; } = [];
  }
}