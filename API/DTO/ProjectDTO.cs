namespace Payroll.DTO
{
  public class ProjectDTO
  {
    public string? ProjectId { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public DateTime StartDate { get; set; }
    public byte StatusId { get; set; }
    public string? Description { get; set; }
  }
}