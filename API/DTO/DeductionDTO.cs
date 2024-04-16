namespace Payroll.DTO
{
  public class DeductionDTO
  {
    public string? DeductionId { get; set; }
    public ushort Key { get; set; }
    public string Name { get; set; } = default!;
    public bool IsHidden { get; set; }
  }
}