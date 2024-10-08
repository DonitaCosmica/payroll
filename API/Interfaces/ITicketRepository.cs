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
    void GetColumnsFromRelatedEntity<T>(T ticket, List<string> columns) where T : class;
    List<string> GetColumns();
    (HashSet<Perception> Perceptions, HashSet<Deduction> Deductions) GetFilteredPerceptionsAndDeductions(List<string> columns);
    float GetBaseSalaryEmployee(string employeeId);
    bool TicketExists(string ticketId);
  }
}