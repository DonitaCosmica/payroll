using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class Period
  {
    [Key]
    [MaxLength(36)]
    public string PeriodId { get; set; } = default!;
    [Required]
    [Range(1, 52, ErrorMessage = "The period number must be between 1 and 52.")]
    public ushort PeriodNumber { get; set; } = default!;
    [Required]
    [Range(2024, ushort.MaxValue)]
    public ushort Year { get; set; }
    public ICollection<Ticket> Tickets { get; set; } = [];
  }
}