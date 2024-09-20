using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repository
{
  public class TableWorkRepository(DataContext context) : ITableWorkRepository
  {
    private readonly DataContext context = context;

    public ICollection<TableWork> GetTableWorks() =>
      [.. IncludeRelatedEntities(context.TableWorks)];
    public TableWork GetTableWork(string tableWorkId) =>
      IncludeRelatedEntities(context.TableWorks).FirstOrDefault(tw => tw.TableWorkId == tableWorkId) ??
      throw new Exception("No Table Work with the specified was found");
    public bool CreateTableWork(TableWork tableWork) => context.CreateEntity(tableWork);
    public bool UpdateTableWork(TableWork tableWork) => context.UpdateEntity(tableWork);
    public bool DeleteTableWork(TableWork tableWork) => context.DeleteEntity(tableWork);
    public bool TableWorkExists(string tableWorkId) => context.TableWorks.Any(tw => tw.TableWorkId == tableWorkId);
    private static IQueryable<TableWork> IncludeRelatedEntities(IQueryable<TableWork> query) =>
      query
        .Include(tw => tw.Ticket)
          .ThenInclude(t => t.Employee);
  }
}