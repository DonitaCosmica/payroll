using API.Helpers;

namespace API.DTO
{
  public class TableWorkDTO
  {
    public string TableWorkId { get; set; } = default!;
    public string Employee { get; set; } = default!;
    public string? Department { get; set; }
    public string? Projects { get; set; }
    public string? JobPosition { get; set; }
    public char StsTr { get; set; }
    public char StsR { get; set; }
    public string? Cta { get; set; }
    public string? Observations { get; set; }
    public float Monday { get; set; }
    public float Tuesday { get; set; }
    public float Wednesday { get; set; }
    public float Thursday { get; set; }
    public float Friday { get; set; }
    public float Saturday { get; set; }
    public float Sunday { get; set; }
  }
}