namespace API.DTO
{
  public class AccountDTO
  {
    public string? AccountId { get; set; }
    public string Name { get; set; } = default!;
    public string AccountNumber { get; set; } = default!;
    public string Reference { get; set; } = default!;
    public string RFC { get; set; } = default!;
  }
}