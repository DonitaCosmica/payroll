using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
  public class TicketRepository(DataContext context) : ITicketRepository
  {
    private readonly DataContext context = context;

    public ICollection<Ticket> GetTickets() => 
      context.Tickets.Include(t => t.Employee).Include(t => t.Period).ToList();
    public Ticket GetTicket(string ticketId) => 
      context.Tickets.Include(t => t.Employee).Include(t => t.Period)
      .FirstOrDefault(t => t.TicketId == ticketId)
      ?? throw new Exception("No Ticket with the specified id was found");
    public List<string> GetColumns() => context.GetColumns<Ticket>();
    public bool TicketExists(string ticketId) => context.Tickets.Any(t => t.TicketId == ticketId);
  }
}