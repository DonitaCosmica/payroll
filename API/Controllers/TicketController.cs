using API.DTO;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TicketController(ITicketRepository ticketRepository) : Controller
  {
    private readonly ITicketRepository ticketRepository = ticketRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TicketDTO>))]
    public IActionResult GetTickets()
    {
      var tickets = ticketRepository.GetTickets().Select(MapToTicketDTORequest);
      var result = new
      {
        Columns = ticketRepository.GetColumns(),
        Tickets = tickets
      };

      return Ok(result);
    }

    [HttpGet("{ticketId}")]
    [ProducesResponseType(200, Type = typeof(TicketDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetTicket(string ticketId)
    {
      if(!ticketRepository.TicketExists(ticketId))
        return NotFound();
      
      var ticket = MapToTicketDTORequest(ticketRepository.GetTicket(ticketId));
      var result = new
      {
        Columns = ticketRepository.GetColumns(),
        Ticket = ticket
      };

      return Ok(result);
    }

    private TicketDTO MapToTicketDTORequest(Ticket? ticket)
    {
      if(ticket == null) return new TicketDTO();

      return new TicketDTO();
    }
  }
}