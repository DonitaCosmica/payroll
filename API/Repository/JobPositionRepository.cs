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
    public ICollection<Employee> GetEmployeesByJobPosition(string jobPositionId) =>
      context.Employees.Where(e => e.JobPosition.JobPositionId == jobPositionId).ToList();
    public bool CreateJobPosition(JobPosition jobPosition)
    {
      context.Add(jobPosition);
      return Save();
    }
    public bool UpdateJobPosition(JobPosition jobPosition)
    {
      context.Update(jobPosition);
      return Save();
    }
    public bool DeleteJobPosition(JobPosition jobPosition)
    {
      context.Remove(jobPosition);
      return Save();
    }
    public bool JobPositionExists(string jobPositionId) => context.JobPositions.Any(jp => jp.JobPositionId == jobPositionId);
    public bool Save() => context.SaveChanges() > 0;
  }
}