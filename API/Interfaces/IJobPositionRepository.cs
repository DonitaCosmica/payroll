using API.Models;

namespace API.Interfaces
{
  public interface IJobPositionRepository
  {
    ICollection<JobPosition> GetJobPositions();
    JobPosition GetJobPosition(string jobPositionId);
    JobPosition GetJobPositionWithDepartment(string jobPositionId);
    JobPosition? GetJobPositionByName(string jobPositionName);
    bool JobPositionExists(string jobPositionId);
    bool CreateJobPosition(JobPosition jobPosition);
    bool UpdateJobPosition(JobPosition jobPosition);
    List<string> GetColumns();
    bool DeleteJobPosition(JobPosition jobPosition);
  }
}