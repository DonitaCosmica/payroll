using API.Models;

namespace API.Helpers
{
  public class EmployeeRelatedEntities
  {
    public Company Company { get; set; } = new();
    public Bank Bank { get; set; } = new();
    public CommercialArea? CommercialArea { get; set; }
    public Contract? Contract { get; set; }
    public FederalEntity? FederalEntity { get; set; }
    public JobPosition JobPosition { get; set; } = new();
    public Regime Regime { get; set; } = new();
    public Status Status { get; set; } = new();
    public State State { get; set; } = new();
  }
}