using System.Text.Json;
using API.DTO;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TableWorkController(ITableWorkRepository tableWorkRepository, 
    IPerceptionRepository perceptionRepository, IDeductionRepository deductionRepository) : Controller
  {
    private readonly ITableWorkRepository tableWorkRepository = tableWorkRepository;
    private readonly IPerceptionRepository perceptionRepository = perceptionRepository;
    private readonly IDeductionRepository deductionRepository = deductionRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TableWorkDTO>))]
    public IActionResult GetTableWorks()
    {
      IEnumerable<TableWorkDTO> tableWorks = tableWorkRepository.GetTableWorks()
        .Select(tw =>
          {
            var item = MapToTableWorkDTORequest(tw);
            var json = JsonSerializer.Serialize(item);
            Console.WriteLine(json);
            return item;
          }
        );

      var columns = tableWorkRepository.GetColumns();
      columns.Remove("TicketId");
      columns.Insert(1, "Projects");
      columns.Insert(2, "Employee");
      columns.Insert(3, "Department");
      columns.Insert(4, "JobPosition");

      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = tableWorks,
        FormData = tableWorks
      };

      return Ok(result);
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
      var columns = tableWorkRepository.GetColumns();
      columns.Remove("TicketId");
      columns.Insert(1, "Projects");
      columns.Insert(2, "Employee");
      columns.Insert(3, "Department");
      columns.Insert(4, "JobPosition");
      
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = tableWork,
        FormData = tableWork
      };

      return Ok(result);
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

    private TableWorkDTO MapToTableWorkDTORequest(TableWork? tableWork)
    {
      if(tableWork == null) return new TableWorkDTO();

      var perceptions = perceptionRepository.GetPerceptions();
      var deductions = deductionRepository.GetDeductions();

      var perceptionValues = perceptions.Select(p =>
      {
        var item = tableWork.Ticket.TicketPerceptions.FirstOrDefault(tp => tp.PerceptionId == p.PerceptionId);
        return new TicketPerceptionRelatedEntities
        {
          PerceptionId = p.PerceptionId,
          Name = p.Description,
          Value = item != null ? item.Total : 0
        };
      });

      var deductionValues = deductions.Select(d =>
      {
        var item = tableWork.Ticket.TicketDeductions.FirstOrDefault(td => td.DeductionId == d.DeductionId);
        return new TicketDeductionRelatedEntities
        {
          DeductionId = d.DeductionId,
          Name = d.Description,
          Value = item != null ? item.Total : 0
        };
      });

      var additionalProperties = perceptionValues
        .ToDictionary(p => p.Name ?? "Unknown Perception", p => p.Value)
        .Concat(deductionValues
          .ToDictionary(d => d.Name ?? "Unknown Perception", d => d.Value))
        .ToDictionary(kv => kv.Key, KeyValuePair => KeyValuePair.Value);

      return new TableWorkDTO
      {
        TableWorkId = tableWork.TableWorkId,
        Employee = tableWork.Ticket.Employee.Name,
        Department = tableWork.Ticket.Department,
        Projects = tableWork.Ticket.Projects,
        JobPosition = tableWork.Ticket.JobPosition,
        StsTr = tableWork.StsTr,
        StsR = tableWork.StsR,
        Cta = tableWork.Cta.ToString(),
        AdditionalProperties = additionalProperties,
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