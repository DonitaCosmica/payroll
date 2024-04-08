using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Bank
  {
    [Key]
    public byte BankId { get; set; } = default!;
    
    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = default!;
    
    public ICollection<Employee> Employees { get; set; } = [];
  }
}