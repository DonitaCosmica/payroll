using API.DTO;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TableWorkController(ITableWorkRepository tableWorkRepository) : Controller
  {
    private readonly ITableWorkRepository tableWorkRepository = tableWorkRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TableWorkDTO>))]
    public IActionResult GetTableWorks()
    {
      IEnumerable<TableWorkDTO> tableWorks = tableWorkRepository.GetTableWorks()
        .Select(MapToTableWorkDTORequest);

      return Ok(tableWorks);
    }

    [HttpGet("{tableWorkId}")]
    [ProducesResponseType(200, Type = typeof(TableWorkDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetTableWork(string tableWorkId)
    {
      if(!tableWorkRepository.TableWorkExists(tableWorkId))
        return NotFound();

      TableWorkDTO tableWork = MapToTableWorkDTORequest(tableWorkRepository.GetTableWork(tableWorkId));
      return Ok(tableWork);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateTableWork([FromBody] TableWorkDTO createTableWork)
    {
      if(createTableWork == null)
        return BadRequest();

      return NoContent();
    }

    [HttpPatch("{tableWorkId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateTableWork(string tableWorkId, [FromBody] TableWorkDTO updateTableWork)
    {
      if(updateTableWork == null)
        return BadRequest();

      return NoContent();
    }

    [HttpDelete("{tableWorkId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteTableWork(string tableWorkId)
    {
      if(!tableWorkRepository.TableWorkExists(tableWorkId))
        return NotFound("Table Work Not Found");

      var tableWorkToDelete = tableWorkRepository.GetTableWork(tableWorkId);
      if(!tableWorkRepository.DeleteTableWork(tableWorkToDelete))
        return StatusCode(500, "Something went wrong deleting table Work");

      return NoContent();
    }

    private static TableWorkDTO MapToTableWorkDTORequest(TableWork? tableWork)
    {
      if(tableWork == null) return new TableWorkDTO();

      return new TableWorkDTO
      {
        Employee = tableWork.Ticket.Employee.Name,
        Department = tableWork.Ticket.Department,
        Projects = tableWork.Ticket.Projects,
        JobPosition = tableWork.Ticket.JobPosition,
        StsTr = tableWork.StsTr,
        StsR = tableWork.StsR,
        Cta = tableWork.Cta.ToString(),
        Observations = tableWork.Observations,
        Monday = tableWork.Monday,
        Tuesday = tableWork.Tuesday,
        Wednesday = tableWork.Wednesday,
        Thursday = tableWork.Thursday,
        Friday = tableWork.Friday,
        Saturday = tableWork.Saturday,
        Sunday = tableWork.Sunday
      };
    }

    private static bool TryConvertToCtaType<TEnum>(string value, out TEnum enumValue) where TEnum : struct, Enum =>
      Enum.TryParse(value, ignoreCase: true, out enumValue);
  }
}