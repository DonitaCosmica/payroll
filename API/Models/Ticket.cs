using System.ComponentModel.DataAnnotations;

namespace Payroll.Models
{
  public class Ticket
  {
    [Key]
    [MaxLength(36)]
    public string TicketId { get; set; } = default!;
  }
}