namespace Payroll.DTO
{
  public class ProjectDTO
  {
    public string ProjectId { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public DateTime StartDate { get; set; }
    public byte StateId { get; set; }
    public string? Description { get; set; }
  }
}