using API.Models;

namespace API.Interfaces
{
  public interface ITableWorkRepository
  {
    ICollection<TableWork> GetTableWorks();
    TableWork GetTableWork(string tableWorkId);
    bool CreateTableWork(TableWork tableWork);
    bool UpdateTableWork(TableWork tableWork);
    bool DeleteTableWork(TableWork tableWork);
    List<string> GetColumns();
    bool TableWorkExists(string tableWorkId);
  }
}