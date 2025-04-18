namespace ERPAPI.DTO;

public class BusinessUnitDTO
{
  public int BusinessUnitId { get; set; }
  public string Name { get; set; } = default!;
  public string Description { get; set; } = default!;
  public string Company { get; set; } = default!;
}