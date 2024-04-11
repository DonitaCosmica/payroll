using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;

namespace Payroll.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CommercialAreaController(ICommercialAreaRepository commercialAreaRepository) : Controller
  {
    private readonly ICommercialAreaRepository commercialAreaRepository = commercialAreaRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<CommercialAreaDTO>))]
    public IActionResult GetCommercialAreas()
    {
      var commercialAreas = commercialAreaRepository.GetCommercialAreas()
        .Select(ca => new CommercialAreaDTO
        {
          CommercialAreaId = ca.CommercialAreaId,
          Name = ca.Name
        }).ToList();

      return Ok(commercialAreas);
    }

    [HttpGet("{commercialAreaId}")]
    [ProducesResponseType(200, Type = typeof(CommercialAreaDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetCommercialArea(string commercialAreaId)
    {
      if(!commercialAreaRepository.CommercialAreaExists(commercialAreaId))
        return NotFound();

      var commercialArea = commercialAreaRepository.GetCommercialArea(commercialAreaId);
      var commercialAreaDTO = new CommercialAreaDTO
      {
        CommercialAreaId = commercialArea.CommercialAreaId,
        Name = commercialArea.Name
      };

      return Ok(commercialAreaDTO);
    }
  }
}