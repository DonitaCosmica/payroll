using API.DTO;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
  public interface ITicketRepository
  {
    ICollection<Ticket> GetTickets();
    ICollection<Ticket> GetTicketsByWeekAndYear(ushort week, ushort year);
    Ticket GetTicket(string ticketId);
    TicketRelatedEntities? GetRelatedEntities(TicketDTO ticketDTO);
    bool CreateTicket(HashSet<TicketPerceptionRelatedEntities> perceptions, 
      HashSet<TicketDeductionRelatedEntities> deductions, Ticket ticket);
    bool UpdateTicket(HashSet<TicketPerceptionRelatedEntities> perceptions, 
      HashSet<TicketDeductionRelatedEntities> deductions, Ticket ticket);
    bool DeleteTicket(Ticket ticket);
    void GetColumnsFromRelatedEntity(TicketListDTO ticket, HashSet<string> columns);
    List<string> GetColumns();
    bool TicketExists(string ticketId);
  }
}