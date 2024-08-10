using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
  public class TicketPerception
  {
    [Key]
    [MaxLength(36)]
    public string TicketPerceptionId { get; set; } = default!;
    [Required]
    [MaxLength(36)]
    public string TicketId { get; set; } = default!;
    [Required]
    [MaxLength(36)]
    public string PerceptionId { get; set; } = default!;
    [Required]
    [Range(100, float.MaxValue)]
    public float Total { get; set; }
    public Ticket Ticket { get; set; } = new();
    public Perception Perception { get; set; } = new();
  }
}