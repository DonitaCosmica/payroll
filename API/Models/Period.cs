using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class Period
  {
    [Key]
    [MaxLength(36)]
    public string PeriodId { get; set; } = default!;
    [Required]
    [MaxLength(30)]
    public ushort PeriodNumber { get; set; } = default!;
    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    [Range(typeof(DateTime), "01-01-1900", "31-12-3000")]
    [RegularExpression(@"pattern")]
    public DateTime StartDate { get; set; }
    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    [Range(typeof(DateTime), "01-01-1900", "31-12-3000")]
    [RegularExpression(@"pattern")]
    public DateTime EndDate { get; set; }
    [Required]
    [Range(2024, ushort.MaxValue)]
    public ushort Year { get; set; }
    public ICollection<Ticket> Tickets { get; set; } = [];
  }
}