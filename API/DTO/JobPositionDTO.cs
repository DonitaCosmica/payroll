namespace Payroll.DTO
{
  public class JobPositionDTO
  {
    public string? JobPositionId { get; set; }
    public string Name { get; set; } = default!;
    public string Department { get; set; } = default!;
  }
}