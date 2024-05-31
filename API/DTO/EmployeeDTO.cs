namespace Payroll.DTO
{
  public class EmployeeDTO
  {
    public string? EmployeeId { get; set; }
    public ushort Key { get; set; }
    public string Name { get; set; } = default!;
    public string RFC { get; set; } = default!;
    public string CURP { get; set; } = default!;
    public string Bank { get; set; } = default!;
    public ulong InterbankCode { get; set; }
    public List<string> Projects { get; set; } = [];
    public string Regime { get; set; } = default!;
    public uint NSS { get; set; }
    public DateTime DateAdmission { get; set; }
    public string JobPosition { get; set; } = default!;
    public string CommercialArea { get; set; } = default!;
    public string Contract { get; set; } = default!;
    public float BaseSalary { get; set; }
    public float DailySalary { get; set; }
    public float ValuePerExtraHour { get; set; } = default!;
    public string FederalEntity { get; set; } = default!;
    public ulong Phone { get; set; }
    public string Email { get; set; } = default!;
    public string? Direction { get; set; }
    public string? Suburb { get; set; }
    public ushort PostalCode { get; set; }
    public string? City { get; set; }
    public string State { get; set; } = default!;
    public string Country { get; set; } = default!;
    public string Status { get; set; } = default!;
    public bool IsProvider { get; set; }
    public uint Credit { get; set; }
    public ulong Contact { get; set; }
    public string Company { get; set; } = default!;
  }
}