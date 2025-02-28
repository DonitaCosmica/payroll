using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;

namespace API.Models
{
  public class Ticket
  {
    [Key]
    [MaxLength(36)]
    public string TicketId { get; set; } = default!;
    [Required]
    [MaxLength(1)]
    public char Serie { get; set; }
    [Required]
    [Range(1, ushort.MaxValue)]
    public ushort Bill { get; set; }
    [Required]
    public string Employee { get; set; } = default!;
    [Required]
    public string JobPosition { get; set; } = default!;
    [Required]
    public string Department { get; set; } = default!;
    [Required]
    [Range(100, float.MaxValue)]
    public float Total { get; set; }
    [Required]
    public string Projects { get; set; } = default!;
    [Required]
    public string Observations { get; set; } = default!;
    [Required]
    public string Company { get; set; } = default!;
    [Required]
    public string PayrollType { get; set; } = default!;
    [Required]
    public string Status { get; set; } = default!;
    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    [Range(typeof(DateTime), "01-01-1900", "31-12-3000")]
    [RegularExpression(@"pattern")]
    public DateTime ReceiptOfDate { get; set; }
    [Required]
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
    [Range(typeof(DateTime), "01-01-1900", "31-12-3000")]
    [RegularExpression(@"pattern")]
    public DateTime PaymentDate { get; set; }
    [Required]
    [MaxLength(36)]
    [ForeignKey("Period")]
    public string PeriodId { get; set; } = default!;
    public Period Period { get; set; } = new();
    [Required]
    [Range(100, float.MaxValue)]
    public float TotalPerceptions { get; set; }
    [Required]
    [Range(100, float.MaxValue)]
    public float TotalDeductions { get; set; }
    [Required]
    [Range(0, float.MaxValue)]
    public float Discount { get; set; }
    public ICollection<TicketPerception> TicketPerceptions { get; set; } = [];
    public ICollection<TicketDeduction> TicketDeductions { get; set;} = [];
    public ICollection<TableWork> TableWorks { get; set; } = [];
  }
}