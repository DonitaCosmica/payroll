using Common.Models;

namespace ERPAPI.Interfaces;

public interface IProjectRepository
{
  ICollection<Project> GetProjects();
}