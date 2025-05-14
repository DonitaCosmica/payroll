namespace ERPAPI.Helpers;

public class ProjectList
{
  public int ProjectId { get; set; }
  public int BusinessUnitId { get; set; }
  public string Project { get; set; } = default!;
  public string Name { get; set; } = default!;
  public DateTime? StartDate { get; set; } 
}