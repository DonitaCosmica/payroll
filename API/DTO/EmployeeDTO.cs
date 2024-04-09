namespace Payroll.DTO
{
  public class EmployeeDTO
  {
    public string EmployeeId { get; set; } = default!;
    public ushort Key { get; set; }
    public string Name { get; set; } = default!;
    public string RFC { get; set; } = default!;
    public string CompanyId { get; set; } = default!;
    public byte BankId { get; set; }
    public ulong InterbankCode { get; set; }
    public uint NSS { get; set; }
    public string JobPositionId { get; set; } = default!;
    public string CommercialAreaId { get; set; } = default!;
    public DateTime DateAdmission { get; set; }
    public float BaseSalary { get; set; }
    public float DailySalary { get; set; }
    public byte StatusId { get; set; }
    public ulong Phone { get; set; }
    public string Email { get; set; } = default!;
    public string? Direction { get; set; }
    public ushort PostalCode { get; set; }
    public string? City { get; set; }
    public ushort StateId { get; set; }
  }
}