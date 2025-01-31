namespace API.DTO
{
  public class PayrollDTO
  {
    public string? PayrollId { get; set; }
    public string Name { get; set; } = default!;
    public string PayrollType { get; set; } = default!;
  }
}