namespace Common.Models;

public class CompanyLite
{
    public string CompanyId { get; set; } = default!;
    public string Name { get; set; } = default!;
    public ushort TotalWorkers { get; set; }
}