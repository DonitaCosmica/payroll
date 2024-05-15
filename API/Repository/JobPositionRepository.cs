using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class JobPositionRepository(DataContext context) : IJobPositionRepository
  {
    private readonly DataContext context = context;

    public ICollection<JobPosition> GetJobPositions() => context.JobPositions.ToList();
    public JobPosition GetJobPosition(string jobPositionId) =>
      context.JobPositions.Where(jp => jp.JobPositionId == jobPositionId).FirstOrDefault() ??
      throw new Exception("No Job Position with specified id was found");
    public bool CreateJobPosition(JobPosition jobPosition) => context.CreateEntity(jobPosition);
    public bool UpdateJobPosition(JobPosition jobPosition) => context.UpdateEntity(jobPosition);
    public bool DeleteJobPosition(JobPosition jobPosition) => context.DeleteEntity(jobPosition);
    public List<string> GetColumns() => context.GetColumns<JobPosition>();
    public bool JobPositionExists(string jobPositionId) => context.JobPositions.Any(jp => jp.JobPositionId == jobPositionId);
  }
}