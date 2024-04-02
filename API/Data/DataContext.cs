using Microsoft.EntityFrameworkCore;
using Payroll.Models;

namespace Payroll.Data
{
  public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
  {
    public virtual DbSet<Bank> Banks { get; set; }
    public virtual DbSet<Department> Departments { get; set; }
    public virtual DbSet<Employee> Employees { get; set; }
    public virtual DbSet<State> States { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      
    }
  }
}