using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class Account
  {
    [Key]
    [MaxLength(36)]
    public string AccountId { get; set; } = default!;
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;
    [Required]
    public string AccountNumber { get; set; } = default!;
    [Required]
    [Range(1, uint.MaxValue)]
    public string Reference { get; set; } = default!;
    [Required]
    public string RFC { get; set; } = default!;
  }
}