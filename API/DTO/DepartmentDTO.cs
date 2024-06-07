namespace Payroll.DTO
{
  public class DepartmentDTO
  {
    public string? DepartmentId { get; set; }
    public string Name { get; set;} = default!;
    public ushort TotalEmployees { get; set; }
    public bool SubContract { get; set; }
  }
}