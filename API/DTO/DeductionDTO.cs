namespace API.DTO
{
  public class DeductionDTO
  {
    public string? DeductionId { get; set; }
    public ushort Key { get; set; }
    public string Description { get; set; } = default!;
    public bool IsHidden { get; set; }
  }
}