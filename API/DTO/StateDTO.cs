namespace API.DTO
{
  public class StateDTO
  {
    public string? StateId { get; set; }
    public string Name { get; set; } = default!;
    public string Abbreviation { get; set; } = default!;
  }
}