using API.DTO;
using API.Enums;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TableWorkController(ITableWorkRepository tableWorkRepository, 
    IPerceptionRepository perceptionRepository, IDeductionRepository deductionRepository,
    ITicketRepository ticketRepository) : Controller
  {
    private readonly ITableWorkRepository tableWorkRepository = tableWorkRepository;
    private readonly IPerceptionRepository perceptionRepository = perceptionRepository;
    private readonly IDeductionRepository deductionRepository = deductionRepository;
    private readonly ITicketRepository ticketRepository = ticketRepository;
    
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TableWorkDTO>))]
    public IActionResult GetTableWorks()
    {
      IEnumerable<TableWorkDTO> tableWorks = tableWorkRepository.GetTableWorks()
        .Select(MapToTableWorkDTORequest);
      IEnumerable<TableWorkFormDTO> tableWorkForms = tableWorkRepository.GetTableWorks()
        .Select(MapToTableWorkFormDTORequest);

      var result = CreateResult(tableWorks, tableWorkForms);
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
      var columns = GetFormattedColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = tableWork,
        FormData = tableWork
      };

      return Ok(result);
    }

    [HttpPatch]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateTableWork([FromBody] List<TableWorkFormDTO> updateTableWork)
    {
      if(updateTableWork == null || updateTableWork.Count == 0)
        return BadRequest();

      foreach(var item in updateTableWork)
      {
        TableWork tableWork = tableWorkRepository.GetTableWork(item.TableWorkId);
        if (tableWork == null)
          return NotFound("Table Work Not Found");

        Ticket ticket = tableWorkRepository.GetRelatedTicket(item.Ticket);
        if(ticket == null)
          return NotFound("Ticket Not Found");

        MapToUpdateTableWork(tableWork, item, ticket);
        if(!tableWorkRepository.UpdateTableWork(tableWork))
          return StatusCode(500, "Something went wrong updating Table Work");

        if(!ticketRepository.UpdateTicket(item.Perceptions, item.Deductions, ticket))
          return StatusCode(500, "Something went wrong updating Ticket");
      }

      return NoContent();
    }

    private static IEnumerable<KeyValuePair<string, float>> GetTicketValues<T>(
      IEnumerable<T> items, Func<T, string> getDescription, Func<T, float> getTotal) =>
      items.Select(item => new KeyValuePair<string, float>(getDescription(item), getTotal(item)));

    private TableWorkDTO MapToTableWorkDTORequest(TableWork? tableWork)
    {
      if(tableWork == null) return new TableWorkDTO();
      var perceptionValues = GetTicketValues(
        perceptionRepository.GetPerceptions(),
        p => p.Description,
        p => tableWork.Ticket.TicketPerceptions.FirstOrDefault(tp => tp.PerceptionId == p.PerceptionId)?.Total ?? 0);

      var deductionValues = GetTicketValues(
        deductionRepository.GetDeductions(),
        d => d.Description,
        d => tableWork.Ticket.TicketDeductions.FirstOrDefault(td => td.DeductionId == d.DeductionId)?.Total ?? 0);

      var additionalProperties = perceptionValues
        .Concat(deductionValues)
        .ToDictionary(kv => kv.Key, kv => kv.Value);

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
        Total = tableWork.Ticket.Total,
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

    private static TableWorkFormDTO MapToTableWorkFormDTORequest(TableWork? tableWork)
    {
      if(tableWork == null) return new TableWorkFormDTO();
      return new TableWorkFormDTO
      {
        TableWorkId = tableWork.TableWorkId,
        Ticket = tableWork.TicketId,
        Employee = tableWork.Ticket.Employee.Name,
        StsTr = tableWork.StsTr,
        StsR = tableWork.StsR,
        Cta = tableWork.Cta.ToString(),
        Perceptions = new HashSet<TicketPerceptionRelatedEntities>(tableWork.Ticket.TicketPerceptions.Select(p =>
          new TicketPerceptionRelatedEntities
          {
            PerceptionId = p.PerceptionId,
            Name = p.Perception.Description,
            Value = p.Total
          })),
        Deductions = new HashSet<TicketDeductionRelatedEntities>(tableWork.Ticket.TicketDeductions.Select(d =>
          new TicketDeductionRelatedEntities
          {
            DeductionId = d.DeductionId,
            Name = d.Deduction.Description,
            Value = d.Total
          })),

        Total = tableWork.Ticket.Total,
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

    private static void MapToUpdateTableWork(TableWork tableWork, TableWorkFormDTO updateTableWork, Ticket ticket)
    {
      if(string.IsNullOrEmpty(updateTableWork.Cta) || !TryConvertToCtaType(updateTableWork.Cta, out CtaOptions cta))
        cta = CtaOptions.Error;

      tableWork.TicketId = updateTableWork.Ticket;
      tableWork.Ticket = ticket;
      tableWork.StsTr = updateTableWork.StsTr;
      tableWork.StsR = updateTableWork.StsR;
      tableWork.Cta = cta;
      tableWork.Observations = updateTableWork.Observations;
      tableWork.Monday = updateTableWork.Monday;
      tableWork.Tuesday = updateTableWork.Tuesday;
      tableWork.Wednesday = updateTableWork.Wednesday;
      tableWork.Thursday = updateTableWork.Thursday;
      tableWork.Friday = updateTableWork.Friday;
      tableWork.Saturday = updateTableWork.Saturday;
      tableWork.Sunday = updateTableWork.Sunday;
    }

    private List<string> GetFormattedColumns()
    {
      var columns = tableWorkRepository.GetColumns();
      var perceptionNames = perceptionRepository.GetPerceptions().Select(p => p.Description).ToList();
      var deductionNames = deductionRepository.GetDeductions().Select(d => d.Description).ToList();

      perceptionNames.Remove("Sueldo");
      perceptionNames.Insert(0, "Sueldo");

      columns.Remove("TicketId");
      columns.Remove("TableWorkId");
      columns.InsertRange(0, ["Department", "Projects", "Employee", "JobPosition"]);
      columns.InsertRange(columns.FindIndex(c => c.Contains("Observations")), perceptionNames);
      columns.InsertRange(columns.FindIndex(c => c.Contains("Observations")), deductionNames);
      columns.Insert(columns.Count - 8, "Total");
      return columns;
    }

    private object CreateResult(IEnumerable<TableWorkDTO> tableWorks, IEnumerable<TableWorkFormDTO> tableWorkForms)
    {
      var columns = GetFormattedColumns();
      return new
      {
        Columns = columns,
        FormColumns = columns,
        Data = tableWorks.Select(MapToResultObject),
        FormData = tableWorkForms
      };
    }

    private static object MapToResultObject(TableWorkDTO tw)
    {
      return new
      {
        tw.TableWorkId,
        tw.Employee,
        tw.Department,
        tw.Projects,
        tw.JobPosition,
        tw.StsTr,
        tw.StsR,
        tw.Cta,
        tw.AdditionalProperties,
        tw.Total,
        tw.Observations,
        tw.Monday,
        tw.Tuesday,
        tw.Wednesday,
        tw.Thursday,
        tw.Friday,
        tw.Saturday,
        tw.Sunday
      };
    }

    private static bool TryConvertToCtaType<TEnum>(string value, out TEnum enumValue) where TEnum : struct, Enum =>
      Enum.TryParse(value, ignoreCase: true, out enumValue);
  }
}