namespace API.DTO
{
  public class ProjectDTO
  {
    public string? ProjectId { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? StartDate { get; set; }
    public string? Status { get; set; }
    public string Company { get; set; } = default!;
    public string? Description { get; set; }
  }
}