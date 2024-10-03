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
    void GetColumnsFromRelatedEntity<T>(T tableWork, List<string> columns) where T : class;
    bool TableWorkExists(string tableWorkId);
  }
}