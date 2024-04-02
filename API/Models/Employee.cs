using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Employee
  {
    [Key]
    [MaxLength(36)]
    public string EmployeeId { get; set; } = default!;

    [Required]
    public ushort Key { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = default!;

    [Required]
    [MaxLength(13)]
    public string RFC { get; set; } = default!;

    [Required]
    [MaxLength(18)]
    public string CURP { get; set; } = default!;

    [Required]
    public ulong InterbankCode { get; set; }

    public uint NSS { get; set; }

    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    [Range(typeof(DateTime), "01-01-1900", "31-12-3000")]
    [RegularExpression(@"pattern")]
    public DateTime DateAdmission { get; set; }

    [Required]
    [Range(100, float.MaxValue)]
    public float BaseSalary { get; set; }

    [Required]
    [Range(100, float.MaxValue)]
    public float DailySalary { get; set; }

    [Required]
    [RegularExpression(@"^\d{10}$")]
    public ulong Phone { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = default!;
  }
}