using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IJobPositionRepository
  {
    ICollection<JobPosition> GetJobPositions();
    JobPosition GetJobPosition(string jobPositionId);
    bool JobPositionExists(string jobPositionId);
    bool CreateJobPosition(JobPosition jobPosition);
    bool UpdateJobPosition(JobPosition jobPosition);
    bool DeleteJobPosition(JobPosition jobPosition);
    bool Save();
  }
}