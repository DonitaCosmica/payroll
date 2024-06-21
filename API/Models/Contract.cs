using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Contract
  {
    [Key]
    [MaxLength(36)]
    public string ContractId { get; set; } = default!;
    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = default!;
    public ICollection<Employee> Employees { get; set; } = [];
  }
}