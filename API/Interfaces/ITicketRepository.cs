using API.Models;

namespace API.Interfaces
{
  public interface ITicketRepository
  {
    ICollection<Ticket> GetTickets();
    Ticket GetTicket(string ticketId);
    List<string> GetColumns();
    bool TicketExists(string ticketId);
  }
}