using API.Helpers;

namespace API.DTO
{
  public class EmployeeListDTO
  {
    public string? EmployeeId { get; set; }
    public string Key { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? RFC { get; set; }
    public string? CURP { get; set; }
    public string Bank { get; set; } = default!;
    public string? BankAccount { get; set; }
    public HashSet<EmployeeProjectRelatedEntities> Projects { get; set; } = [];
    public string? NSS { get; set; }
    public string DateAdmission { get; set; } = default!;
    public string JobPosition { get; set; } = default!;
    public string? Department { get; set; }
    public string? CommercialArea { get; set; }
    public float BaseSalary { get; set; }
    public float DailySalary { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string Status { get; set; } = default!;
    public string Company { get; set; } = default!;
  }
}