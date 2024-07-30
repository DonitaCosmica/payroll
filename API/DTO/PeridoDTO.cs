namespace API.DTO
{
  public class PeriodDTO
  {
    public string? PeriodId { get; set; }
    public ushort PeriodNumber { get; set; }
    public string StartDate { get; set; } = default!;
    public string EndDate { get; set; } = default!;
    public ushort Year { get; set; }
  }
}