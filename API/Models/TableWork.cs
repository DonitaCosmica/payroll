using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;

namespace API.Models
{
  public class TableWork
  {
    [Key]
    [MaxLength(36)]
    public string TableWorkId { get; set; } = default!;
    [Required]
    [MaxLength(36)]
    [ForeignKey("Ticket")]
    public string TicketId { get; set; } = default!;
    public Ticket Ticket { get; set; } = new();
    [Required]
    [MaxLength(1)]
    public char StsTr { get; set; }
    [Required]
    [MaxLength(1)]
    public char StsR { get; set; }
    [Required]
    public CtaOptions Cta { get; set; }
    [Required]
    public string Observations { get; set; } = default!;
    [Required]
    public float Monday { get; set; }
    [Required]
    public float Tuesday { get; set; }
    [Required]
    public float Wednesday { get; set; }
    [Required]
    public float Thursday { get; set; }
    [Required]
    public float Friday { get; set; }
    [Required]
    public float Saturday { get; set; }
    [Required]
    public float Sunday { get; set; }
  }
}