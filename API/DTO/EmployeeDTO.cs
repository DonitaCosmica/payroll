namespace Payroll.DTO
{
  public class EmployeeDTO
  {
    public string? EmployeeId { get; set; }
    public ushort Key { get; set; }
    public string Name { get; set; } = default!;
    public string RFC { get; set; } = default!;
    public string CURP { get; set; } = default!;
    public string Company { get; set; } = default!;
    public string Bank { get; set; } = default!;
    public ulong InterbankCode { get; set; }
    public List<string> Projects{ get; set; } = [];
    public uint NSS { get; set; }
    public string JobPosition { get; set; } = default!;
    public string CommercialArea { get; set; } = default!;
    public DateTime DateAdmission { get; set; }
    public float BaseSalary { get; set; }
    public float DailySalary { get; set; }
    public string Status { get; set; } = default!;
    public ulong Phone { get; set; }
    public string Email { get; set; } = default!;
    public string? Direction { get; set; }
    public ushort PostalCode { get; set; }
    public string? City { get; set; }
    public string State { get; set; } = default!;
  }
}