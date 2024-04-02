using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Bank
  {
    [Key]
    [MaxLength(36)]
    public string BankId { get; set; } = default!;
    
    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = default!;
    
  }
}