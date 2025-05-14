using System.Globalization;
using Common.DTO;
using ERPAPI.Helpers;
using ERPAPI.Interfaces;
using ERPAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace ERPAPI.Controllers;

[Route("erpapi/[controller]")]
[ApiController]
public class ProjectController(IBusinessUnitRepository businessUnitRepository,
  IProjectRepository projectRepository) : Controller
{
  private readonly IBusinessUnitRepository businessUnitRepository = businessUnitRepository;
  private readonly IProjectRepository projectRepository = projectRepository;  

  [HttpGet]
  [ProducesResponseType(200, Type = typeof(IEnumerable<object>))]
  public IActionResult GetProjects()
  {
    List<ProjectList> projects = [.. projectRepository.GetProjects().Select(MapToProjectDTORequest)];
    List<BusinessUnitDTO> businessUnits = [.. businessUnitRepository
      .GetBusinessUnits()
      .Select(b => MapToBusinessUnitDTORequest(b, projects))];
    return Ok(businessUnits);
  }

  private ProjectList MapToProjectDTORequest(Project? project)
  {
    if(project == null) return new ProjectList();

    return new ProjectList
    {
      ProjectId = project.IdProyecto,
      BusinessUnitId = project.IdUnidadNegocio ?? 0,
      Name = project.Nombre ?? "Sin nombre",
      Project = project.Proyecto1,
      StartDate = project.FechaInicio
    };
  }

  private static BusinessUnitDTO MapToBusinessUnitDTORequest(BusinessUnit? businessUnit, List<ProjectList> projects)
  {
    if(businessUnit == null) return new BusinessUnitDTO();

    return new BusinessUnitDTO
    {
      BusinessUnitId = businessUnit.IdUnidadNegocio.ToString(),
      Code = businessUnit.UnidadNegocio,
      Description = businessUnit.Descripcion,
      SharedProjects = [.. projects
      .Where(p=> businessUnit.IdUnidadNegocio == p.BusinessUnitId)
      .Select(p => new SharedProjectDTO
      {
        ProjectId = p.ProjectId.ToString(),
        Code = p.Project,
        Name = p.Name,
        StartDate = (p.StartDate ?? DateTime.Now).ToString("yyyy-MM-dd"),
        Description = businessUnit.Descripcion
      })],
    };
  }
}