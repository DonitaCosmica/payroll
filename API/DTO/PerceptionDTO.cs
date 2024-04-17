namespace Payroll.DTO
{
  public class PerceptionDTO
  {
    public string? PerceptionId { get; set; }
    public ushort Key { get; set; }
    public string Name { get; set; } = default!;
    public bool IsHidden { get; set; }
  }
}