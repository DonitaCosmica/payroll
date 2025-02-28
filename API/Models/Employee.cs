using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
  public class Employee
  {
    [Key]
    [MaxLength(36)]
    public string EmployeeId { get; set; } = default!;
    [Required]
    public string Key { get; set; } = default!;
    [Required]
    [MaxLength(75)]
    public string Name { get; set; } = default!;
    [Required]
    [MaxLength(13)]
    public string RFC { get; set; } = default!;
    [Required]
    [MaxLength(18)]
    public string CURP { get; set; } = default!;
    [Required]
    [MaxLength(36)]
    [ForeignKey("Bank")]
    public string BankId { get; set; }  = default!;
    public Bank Bank { get; set; } = new();
    [Required]
    public ulong InterbankCode { get; set; }
    public string BankAccount { get; set; } = default!;
    [Required]
    public ulong BankPortal { get; set; }
    public bool IsAStarter { get; set; }
    public ICollection<EmployeeProject> EmployeeProjects { get; set; } = [];
    [MaxLength(36)]
    [ForeignKey("Regime")]
    public string? RegimeId { get; set; }
    public Regime? Regime { get; set; }
    public uint NSS { get; set; }
    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    [Range(typeof(DateTime), "01-01-1900", "31-12-3000")]
    [RegularExpression(@"pattern")]
    public DateTime DateAdmission { get; set; }
    [Required]
    [MaxLength(36)]
    [ForeignKey("JobPosition")]
    public string JobPositionId { get; set; } = default!;
    public JobPosition JobPosition { get; set; } = new();
    [MaxLength(36)]
    [ForeignKey("CommercialArea")]
    public string? CommercialAreaId { get; set; }
    public CommercialArea? CommercialArea { get; set; }
    [MaxLength(36)]
    [ForeignKey("Contract")]
    public string? ContractId { get; set; }
    public Contract? Contract { get; set; }
    [Required]
    [Range(100, float.MaxValue)]
    public float BaseSalary { get; set; }
    [Required]
    [Range(100, float.MaxValue)]
    public float DailySalary { get; set; }
    [MaxLength(36)]
    [ForeignKey("FederalEntity")]
    public string? FederalEntityId { get; set; }
    public FederalEntity? FederalEntity { get; set; }
    [Required]
    [RegularExpression(@"^\d{10}$")]
    public ulong Phone { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; } = default!;
    [MaxLength(75)]
    public string? Direction { get; set; }
    [MaxLength(50)]
    public string? Suburb { get; set; }
    public ushort PostalCode { get; set; }
    [MaxLength(50)]
    public string? City { get; set; }
    [Required]
    [MaxLength(36)]
    [ForeignKey("State")]
    public string StateId { get; set; } = default!;
    public State State { get; set; } = new();
    [Required]
    [MaxLength(30)]
    public string Country { get; set; } = default!;
    [Required]
    [MaxLength(36)]
    [ForeignKey("Status")]
    public string StatusId { get; set; } = default!;
    public Status Status { get; set; } = new();
    [Required]
    public bool IsProvider { get; set; }
    [Required]
    [Range(100, uint.MaxValue)]
    public uint Credit { get; set; }
    [Required]
    [Range(100, ulong.MaxValue)]
    public ulong Contact { get; set; }
    [Required]
    [MaxLength(36)]
    [ForeignKey("Company")]
    public string CompanyId { get; set; } = default!;
    public Company Company { get; set; } = new();
  }
}