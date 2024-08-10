using API.DTO;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
  public interface ITicketRepository
  {
    ICollection<Ticket> GetTickets();
    ICollection<Ticket> GetTicketsByWeekAndYear(int week, int year);
    Ticket GetTicket(string ticketId);
    TicketRelatedEntities? GetRelatedEntities(TicketDTO ticketDTO);
    List<string> GetColumns();
    bool TicketExists(string ticketId);
  }
}