namespace API.DTO
{
  public class StatusDTO
  {
    public string? StatusId { get; set; }
    public string Name { get; set; } = default!;
    public string? StatusType { get; set; }
    public string? StatusOption { get; set; }
    public string? StatusCode { get; set; }
  }
}