using API.Helpers;

namespace API.DTO
{
  public class EmployeeListDTO
  {
    public string? EmployeeId { get; set; }
    public ushort Key { get; set; }
    public string Name { get; set; } = default!;
    public string RFC { get; set; } = default!;
    public string CURP { get; set; } = default!;
    public string Bank { get; set; } = default!;
    public ulong BankAccount { get; set; }
    public HashSet<EmployeeProjectRelatedEntities> Projects { get; set; } = [];
    public uint NSS { get; set; }
    public string DateAdmission { get; set; } = default!;
    public string JobPosition { get; set; } = default!;
    public string? Department { get; set; }
    public string CommercialArea { get; set; } = default!;
    public float BaseSalary { get; set; }
    public float DailySalary { get; set; }
    public ulong Phone { get; set; }
    public string Email { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string Company { get; set; } = default!;
  }
}