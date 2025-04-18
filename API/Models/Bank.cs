using System.ComponentModel.DataAnnotations;

namespace API.Models
{
  public class Bank
  {
    [Key]
    [MaxLength(36)]
    public string BankId { get; set; } = default!;
    [Required]
    public string Code { get; set; } = default!;
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;
    public ICollection<Employee> Employees { get; set; } = [];
  }
}