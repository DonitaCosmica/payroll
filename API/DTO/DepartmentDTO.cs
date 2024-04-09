namespace Payroll.DTO
{
  public class DepartmentDTO
  {
    public string DepartmentId { get; set; } = default!;
    public string Name { get; set;} = default!;
    public ushort TotalEmployees { get; set; }
  }
}