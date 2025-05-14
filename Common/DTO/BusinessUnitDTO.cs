namespace Common.DTO;

public class BusinessUnitDTO
{
  public string BusinessUnitId { get; set; } = default!;
  public string Code { get; set; } = default!;
  public string Description { get; set; } = default!;
  public List<SharedProjectDTO> SharedProjects { get; set; } = default!;
}