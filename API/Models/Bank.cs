using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Payroll.Models
{
  public class Bank
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public byte BankId { get; set; } = default!;
    
    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = default!;
    
    public ICollection<Employee> Employees { get; set; } = [];
  }
}