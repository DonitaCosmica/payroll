namespace API.DTO
{
  public class DeductionDTO
  {
    public string? DeductionId { get; set; }
    public string Key { get; set; } = default!;
    public string Description { get; set; } = default!;
    public bool IsHidden { get; set; }
  }
}