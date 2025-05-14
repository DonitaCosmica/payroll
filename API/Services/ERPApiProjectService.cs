using Common.DTO;

namespace API.Services;

public class ERPApiProjectService(IHttpClientFactory factory)
{
  private readonly HttpClient httpClient = factory.CreateClient("ERPAPI");

  public async Task<List<BusinessUnitDTO>> GetProjectsFromErpApi()
  {
    var businessUnits = await httpClient.GetFromJsonAsync<List<BusinessUnitDTO>>("project");
    return businessUnits ?? [];
  }
}