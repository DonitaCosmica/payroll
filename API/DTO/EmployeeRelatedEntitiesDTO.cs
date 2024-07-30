using API.Models;

namespace API.DTO
{
  public class EmployeeRelatedEntitiesDTO
  {
    public Company Company { get; set; } = new();
    public Bank Bank { get; set; } = new();
    public CommercialArea CommercialArea { get; set; } = new();
    public Contract Contract { get; set; } = new();
    public FederalEntity FederalEntity { get; set; } = new();
    public JobPosition JobPosition { get; set; } = new();
    public Regime Regime { get; set; } = new();
    public Status Status { get; set; } = new();
    public State State { get; set; } = new();
  }
}