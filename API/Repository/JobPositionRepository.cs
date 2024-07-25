using Microsoft.EntityFrameworkCore;
using Payroll.Data;
using Payroll.Interfaces;
using Payroll.Models;

namespace Payroll.Repository
{
  public class JobPositionRepository(DataContext context) : IJobPositionRepository
  {
    private readonly DataContext context = context;

    public ICollection<JobPosition> GetJobPositions() => 
      context.JobPositions.Include(jp => jp.Department).ToList();
    public JobPosition GetJobPosition(string jobPositionId) =>
      context.JobPositions.Include(jp => jp.Department)
      .FirstOrDefault(jp => jp.JobPositionId == jobPositionId) ??
      throw new Exception("No Job Position with specified id was found");
    public JobPosition GetJobPositionWithDepartment(string jobPositionId) => 
      context.JobPositions.Include(jp => jp.Department).FirstOrDefault(jp => jp.JobPositionId == jobPositionId)
      ?? throw new Exception("No job Position with specified id was found");
    public JobPosition? GetJobPositionByName(string jobPositionName) => context.GetEntityByName<JobPosition>(jobPositionName);
    public bool CreateJobPosition(JobPosition jobPosition) => context.CreateEntity(jobPosition);
    public bool UpdateJobPosition(JobPosition jobPosition) => context.UpdateEntity(jobPosition);
    public bool DeleteJobPosition(JobPosition jobPosition) => context.DeleteEntity(jobPosition);
    public List<string> GetColumns() => context.GetColumns<JobPosition>();
    public bool JobPositionExists(string jobPositionId) => context.JobPositions.Any(jp => jp.JobPositionId == jobPositionId);
  }
}