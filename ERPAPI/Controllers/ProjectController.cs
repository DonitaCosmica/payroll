using ERPAPI.DTO;
using ERPAPI.Interfaces;
using Common.Models;
using Common.DTO;
using Microsoft.AspNetCore.Mvc;
using Common.Interfaces;

namespace ERPAPI.Controllers;

[Route("erpapi/[controller]")]
[ApiController]
public class ProjectController(IBusinessUnitRepository businessUnitRepository,
  IProjectRepository projectRepository, ICompanyLiteRepository companyLiteRepository) : Controller
{
  private readonly IBusinessUnitRepository businessUnitRepository = businessUnitRepository;
  private readonly IProjectRepository projectRepository = projectRepository;
  private readonly ICompanyLiteRepository companyLiteRepository = companyLiteRepository;
  

  [HttpGet]
  [ProducesResponseType(200, Type = typeof(IEnumerable<object>))]
  public IActionResult GetProjects()
  {
    List<ProjectDTO> projects = [.. projectRepository.GetProjects().Select(MapToProjectDTORequest)];
    List<BusinessUnitDTO> businessUnits = [.. businessUnitRepository.GetBusinessUnits().Select(MapToBusinessUnitDTORequest)];
    var result = new
    {
      projects,
      businessUnits
    };
    
    return Ok(result);
  }

  private BusinessUnitDTO MapToBusinessUnitDTORequest(BusinessUnit? businessUnit)
  {
    if(businessUnit == null) return new BusinessUnitDTO();

    CompanyLite company = companyLiteRepository.GetCompanyByMatchPrefix(businessUnit.UnidadNegocio.Substring(1, 3));
    return new BusinessUnitDTO
    {
      BusinessUnitId = businessUnit.IdUnidadNegocio,
      Name = businessUnit.UnidadNegocio,
      Company = company.Name,
      Description = businessUnit.Descripcion
    };
  }

  private ProjectDTO MapToProjectDTORequest(Project? project)
  {
    if(project == null) return new ProjectDTO();

    return new ProjectDTO
    {
      ProjectId = project.IdProyecto,
      BusinessUnitId = project.IdUnidadNegocio ?? 0,
      Name = project.Nombre ?? "Sin nombre",
      Project = project.Proyecto1
    };
  }

  private object CreateResult(List<BusinessUnitDTO> businessUnitDTOs, List<ProjectDTO> projectDTOs)
  {
    return new
    {

    };
  }
}