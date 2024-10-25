namespace API.DTO
{
  public class AccountDTO
  {
    public string AccountId { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string AccountNumber { get; set; } = default!;
    public uint Reference { get; set; }
    public string RFC { get; set; } = default!;
  }
}