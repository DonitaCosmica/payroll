using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Payroll.Models;

namespace Payroll.Data
{
  public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
  {
    private readonly Dictionary<Type, List<string>> cachedColumns = [];
    public virtual DbSet<Bank> Banks { get; set; }
    public virtual DbSet<CommercialArea> CommercialAreas { get; set; }
    public virtual DbSet<Company> Companies { get; set; }
    public virtual DbSet<Deduction> Deductions { get; set; }
    public virtual DbSet<Department> Departments { get; set; }
    public virtual DbSet<Employee> Employees { get; set; }
    public virtual DbSet<EmployeeProject> EmployeeProjects { get; set; }
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
        .HasForeignKey(p => p.StatusId)
        .OnDelete(DeleteBehavior.Restrict);

      modelBuilder.Entity<Employee>(entity => entity.HasKey(e => e.EmployeeId));
      modelBuilder.Entity<Employee>()
        .HasOne(e => e.Bank)
        .WithMany(b => b.Employees)
        .HasForeignKey(e => e.BankId);
      modelBuilder.Entity<Employee>()
        .HasOne(e => e.CommercialArea)
        .WithMany(ca => ca.Employees)
        .HasForeignKey(e => e.CommercialAreaId);
      modelBuilder.Entity<Employee>()
        .HasOne(e => e.Company)
        .WithMany(c => c.Employees)
        .HasForeignKey(e => e.CompanyId);
      modelBuilder.Entity<Employee>()
        .HasOne(e => e.JobPosition)
        .WithMany(jp => jp.Employees)
        .HasForeignKey(e => e.JobPositionId);
      modelBuilder.Entity<Employee>()
        .HasOne(e => e.State)
        .WithMany(s => s.Employees)
        .HasForeignKey(e => e.StateId);
      modelBuilder.Entity<Employee>()
        .HasOne(e => e.Status)
        .WithMany(s => s.Employees)
        .HasForeignKey(e => e.StatusId);

      modelBuilder.Entity<EmployeeProject>()
        .HasKey(ep => new { ep.EmployeeId, ep.ProjectId });
      modelBuilder.Entity<EmployeeProject>()
        .HasOne(e => e.Employee)
        .WithMany(ep => ep.EmployeeProjects)
        .HasForeignKey(e => e.EmployeeId)
        .OnDelete(DeleteBehavior.Cascade);
      modelBuilder.Entity<EmployeeProject>()
        .HasOne(p => p.Project)
        .WithMany(ep => ep.EmployeeProjects)
        .HasForeignKey(p => p.ProjectId)
        .OnDelete(DeleteBehavior.Restrict);

      base.OnModelCreating(modelBuilder);
    }

    public List<string> GetColumns<TEntity>() where TEntity : class
    {
      var entityType = Model.FindEntityType(typeof(TEntity));
      if(entityType == null)
        return [];

      var entityTypeClrType = entityType.ClrType;
      if(cachedColumns.TryGetValue(entityTypeClrType, out List<string>? value))
        return value;

      List<string> columnNames = [];
      var columnsQuery = $@"
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = @TableName;
      ";

      using(var command = Database.GetDbConnection().CreateCommand())
      {
        command.CommandText = columnsQuery;
        command.Parameters.Add(new SqlParameter("@TableName", SqlDbType.NVarChar) { Value = entityType.GetTableName() });
        Database.OpenConnection();
        using var reader = command.ExecuteReader();
        while (reader.Read())
          columnNames.Add(reader.GetString(0));
      }
      
      cachedColumns[entityTypeClrType] = columnNames;
      return columnNames;
    }

    public bool CreateEntity<TEntity>(TEntity entity) where TEntity : class
    {
      Add(entity);
      return Save();
    }

    public bool UpdateEntity<TEntity>(TEntity entity) where TEntity : class
    {
      Update(entity);
      return Save();
    }

    public bool DeleteEntity<TEntity>(TEntity entity) where TEntity : class
    {
      Remove(entity);
      return Save();
    } 

    private bool Save() => SaveChanges() > 0; 
  }
}