namespace API.DTO
{
  public class PerceptionDTO
  {
    public string? PerceptionId { get; set; }
    public ushort Key { get; set; }
    public string Description { get; set; } = default!;
    public bool IsHidden { get; set; }
  }
}