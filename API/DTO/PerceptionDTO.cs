namespace Payroll.DTO
{
  public class PerceptionDTO
  {
    public string PerceptionId { get; set; } = default!;
    public ushort Key { get; set; }
    public string Name { get; set; } = default!;
    public bool IsHidden { get; set; }
  }
}