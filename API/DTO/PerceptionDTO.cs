namespace API.DTO
{
  public class PerceptionDTO
  {
    public string? PerceptionId { get; set; }
    public string Key { get; set; } = default!;
    public string Description { get; set; } = default!;
    public bool IsHidden { get; set; }
  }
}