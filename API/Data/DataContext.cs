using Microsoft.EntityFrameworkCore;
using Payroll.Models;

namespace Payroll.Data
{
  public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
  {
    public virtual DbSet<Bank> Banks { get; set; }
    public virtual DbSet<CommercialArea> CommercialAreas { get; set; }
    public virtual DbSet<Company> Companies { get; set; }
    public virtual DbSet<Deduction> Deductions { get; set; }
    public virtual DbSet<Department> Departments { get; set; }
    public virtual DbSet<Employee> Employees { get; set; }
    public virtual DbSet<JobPosition> JobPositions { get; set; }
    public virtual DbSet<Perception> Perceptions { get; set; }
    public virtual DbSet<Project> Projects { get; set; }
    public virtual DbSet<State> States { get; set; }
    public virtual DbSet<Status> Statuses { get; set; }
    public virtual DbSet<Ticket> Tickets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<JobPosition>(entity => entity.HasKey(j => j.JobPositionId));
      modelBuilder.Entity<JobPosition>()
        .HasOne(j => j.Department)
        .WithMany(d => d.JobPositions)
        .HasForeignKey(j => j.DepartmentId);
      
      modelBuilder.Entity<Project>(entity => entity.HasKey(p => p.ProjectId));
      modelBuilder.Entity<Project>()
        .HasOne(p => p.Status)
        .WithMany(s => s.Projects)
        .HasForeignKey(p => p.StatusId);

      base.OnModelCreating(modelBuilder);
    }
  }
}