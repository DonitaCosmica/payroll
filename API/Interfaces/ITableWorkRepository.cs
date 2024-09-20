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
    bool TableWorkExists(string tableWorkId);
  }
}