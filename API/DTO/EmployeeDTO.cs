using API.Helpers;

namespace API.DTO
{
  public class EmployeeDTO
  {
    public string? EmployeeId { get; set; }
    public ushort Key { get; set; }
    public string Name { get; set; } = default!;
    public string? RFC { get; set; }
    public string? CURP { get; set; }
    public string Bank { get; set; } = default!;
    public string? InterbankCode { get; set; }
    public string? BankAccount { get; set; } = default!;
    public ulong BankPortal { get; set; }
    public bool IsAStarter { get; set; }
    public HashSet<EmployeeProjectRelatedEntities> Projects { get; set; } = [];
    public string? Regime { get; set; }
    public string? NSS { get; set; }
    public string DateAdmission { get; set; } = default!;
    public string JobPosition { get; set; } = default!;
    public string? Department { get; set; }
    public string? CommercialArea { get; set; }
    public string? Contract { get; set; }
    public float BaseSalary { get; set; }
    public float DailySalary { get; set; }
    public string? FederalEntity { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; } = default!;
    public string? Direction { get; set; }
    public string? Suburb { get; set; }
    public ushort? PostalCode { get; set; }
    public string? City { get; set; }
    public string? State { get; set; } = default!;
    public string? Country { get; set; } = default!;
    public string Status { get; set; } = default!;
    public bool IsProvider { get; set; }
    public uint? Credit { get; set; }
    public string? Contact { get; set; }
    public string Company { get; set; } = default!;
  }
}