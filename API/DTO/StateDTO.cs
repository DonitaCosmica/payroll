namespace Payroll.DTO
{
  public class StateDTO
  {
    public ushort StateId { get; set; }
    public string Name { get; set; } = default!;
    public string Abbreviation { get; set; } = default!;
  }
}