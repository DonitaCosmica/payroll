namespace API.DTO
{
  public class BankDTO
  {
    public string? BankId { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
  }
}