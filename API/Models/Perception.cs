using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class Perception
  {
    [Key]
    [MaxLength(36)]
    public string PerceptionId { get; set; } = default!;

    [Required]
    public ushort Key { get; set; }

    [Required]
    [MaxLength(75)]
    public string Description { get; set; } = default!;

    public bool IsHidden { get; set; }
  }
}