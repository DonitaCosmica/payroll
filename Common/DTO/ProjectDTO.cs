namespace Common.DTO;

public class ProjectDTO
{
  public int ProjectId { get; set; }
  public int BusinessUnitId { get; set; }
  public string Project { get; set; } = default!;
  public string Name { get; set; } = default!;
  public string Status { get; set; } = default!;
}