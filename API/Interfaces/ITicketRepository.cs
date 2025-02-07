using API.DTO;
using API.Helpers;
using API.Models;

namespace API.Interfaces
{
  public interface ITicketRepository
  {
    ICollection<Ticket> GetTickets(string? payrollType = null);
    ICollection<Ticket> GetTicketsByWeekAndYear(ushort week, ushort year, string? payrollType = null);
    Ticket GetTicket(string ticketId);
    TicketRelatedEntities? GetRelatedEntities(TicketDTO ticketDTO);
    float GetBaseSalaryEmployee(string employeeName, string jobPosition, string department);
    (char nextSerie, ushort nextBill) GenerateNextTicket();
    float GetTotalSum(string payrollType);
    bool TicketExists(string ticketId);
    bool CreateTicket(HashSet<TicketPerceptionRelatedEntities> perceptions, 
      HashSet<TicketDeductionRelatedEntities> deductions, Ticket ticket);
    bool UpdateTicket(HashSet<TicketPerceptionRelatedEntities> perceptions, 
      HashSet<TicketDeductionRelatedEntities> deductions, Ticket ticket);
    bool DeleteTicket(Ticket ticket);
    void GetColumnsFromRelatedEntity<T>(T ticket, List<string> columns) where T : class;
    List<string> GetColumns();
    (HashSet<Perception> Perceptions, HashSet<Deduction> Deductions) GetFilteredPerceptionsAndDeductions(List<string> columns);
  }
}