namespace API.DTO
{
  public class CompanyDTO
  {
    public string? CompanyId { get; set; }
    public string Name { get; set; } = default!;
    public ushort TotalWorkers { get; set; }
  }
}