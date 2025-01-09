using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Enums;
using System.Linq.Expressions;
using System.Reflection;

namespace API.Data
{
  public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
  {
    private readonly Dictionary<Type, List<string>> cachedColumns = [];
    public virtual required DbSet<Account> Accounts { get; set; }
    public virtual required DbSet<Bank> Banks { get; set; }
    public virtual required DbSet<CommercialArea> CommercialAreas { get; set; }
    public virtual required DbSet<Company> Companies { get; set; }
    public virtual required DbSet<Contract> Contracts { get; set; }
    public virtual required DbSet<Deduction> Deductions { get; set; }
    public virtual required DbSet<Department> Departments { get; set; }
    public virtual required DbSet<Employee> Employees { get; set; }
    public virtual required DbSet<EmployeeProject> EmployeeProjects { get; set; }
    public virtual required DbSet<FederalEntity> FederalEntities { get; set; }
    public virtual required DbSet<JobPosition> JobPositions { get; set; }
    public virtual required DbSet<Payroll> Payrolls { get; set; }
    public virtual required DbSet<Perception> Perceptions { get; set; }
    public virtual required DbSet<Period> Periods { get; set; }
    public virtual required DbSet<Project> Projects { get; set; }
    public virtual required DbSet<Regime> Regimes { get; set; }
    public virtual required DbSet<State> States { get; set; }
    public virtual required DbSet<Status> Statuses { get; set; }
    public virtual required DbSet<TableWork> TableWorks { get; set; }
    public virtual required DbSet<Ticket> Tickets { get; set; }
    public virtual required DbSet<TicketPerception> TicketPerceptions { get; set; }
    public virtual required DbSet<TicketDeduction> TicketDeductions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.UseCollation("Latin1_General_CI_AS");

      modelBuilder.Entity<Status>(entity =>
      {
        entity.Property(s => s.StatusType)
          .HasConversion(v => v.ToString(), v => (StatusType)Enum.Parse(typeof(StatusType), v));
        entity.Property(s => s.StatusOption)
          .HasConversion(v => v.ToString(), v => (StatusOption)Enum.Parse(typeof(StatusOption), v));
      });

      modelBuilder.Entity<JobPosition>(entity =>
      {
        entity.HasKey(j => j.JobPositionId);
        entity.HasOne(j => j.Department)
          .WithMany(d => d.JobPositions)
          .HasForeignKey(j => j.DepartmentId);
      });

      modelBuilder.Entity<Project>(entity =>
      {
        entity.HasKey(p => p.ProjectId);
        entity.HasOne(p => p.Status)
          .WithMany(s => s.Projects)
          .HasForeignKey(p => p.StatusId)
          .OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(p => p.Company)
          .WithMany(c => c.Projects)
          .HasForeignKey(p => p.CompanyId)
          .OnDelete(DeleteBehavior.Restrict);
      });

      modelBuilder.Entity<Employee>(entity =>
      {
        entity.HasKey(e => e.EmployeeId);
        entity.HasOne(e => e.Bank)
          .WithMany(b => b.Employees)
          .HasForeignKey(e => e.BankId);
        entity.HasOne(e => e.CommercialArea)
          .WithMany(ca => ca.Employees)
          .HasForeignKey(e => e.CommercialAreaId);
        entity.HasOne(e => e.Company)
          .WithMany(c => c.Employees)
          .HasForeignKey(e => e.CompanyId)
          .OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(e => e.Contract)
          .WithMany(ct => ct.Employees)
          .HasForeignKey(e => e.ContractId);
        entity.HasOne(e => e.FederalEntity)
          .WithMany(fe => fe.Employees)
          .HasForeignKey(e => e.FederalEntityId);
        entity.HasOne(e => e.JobPosition)
          .WithMany(jp => jp.Employees)
          .HasForeignKey(e => e.JobPositionId)
          .OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(e => e.Regime)
          .WithMany(r => r.Employees)
          .HasForeignKey(e => e.RegimeId);
        entity.HasOne(e => e.State)
          .WithMany(s => s.Employees)
          .HasForeignKey(e => e.StateId);
        entity.HasOne(e => e.Status)
          .WithMany(s => s.Employees)
          .HasForeignKey(e => e.StatusId)
          .OnDelete(DeleteBehavior.Restrict);
      });

      modelBuilder.Entity<EmployeeProject>(entity =>
      {
        entity.HasKey(ep => new { ep.EmployeeId, ep.ProjectId });
        entity.HasOne(e => e.Employee)
          .WithMany(ep => ep.EmployeeProjects)
          .HasForeignKey(e => e.EmployeeId)
          .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(p => p.Project)
          .WithMany(ep => ep.EmployeeProjects)
          .HasForeignKey(p => p.ProjectId)
          .OnDelete(DeleteBehavior.Restrict);
      });

      modelBuilder.Entity<Ticket>(entity =>
      {
        entity.HasKey(t => t.TicketId);
        entity.Property(t => t.PayrollType)
          .HasConversion(
            v => v.ToString(),
            v => (PayrollType)Enum.Parse(typeof(PayrollType), v));
        entity.HasOne(t => t.Period)
          .WithMany(pr => pr.Tickets)
          .HasForeignKey(t => t.PeriodId)
          .OnDelete(DeleteBehavior.Cascade);
      });

      modelBuilder.Entity<TicketPerception>(entity =>
      {
        entity.HasKey(tp => tp.TicketPerceptionId);
        entity.HasOne(tp => tp.Ticket)
          .WithMany(t => t.TicketPerceptions)
          .HasForeignKey(tp => tp.TicketId)
          .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(tp => tp.Perception)
          .WithMany(p => p.TicketPerceptions)
          .HasForeignKey(tp => tp.PerceptionId)
          .OnDelete(DeleteBehavior.SetNull);
        entity.Property(td => td.PerceptionId)
          .IsRequired(false);
      });

      modelBuilder.Entity<TicketDeduction>(entity =>
      {
        entity.HasKey(td => td.TicketDeductionId);
        entity.HasOne(td => td.Ticket)
          .WithMany(t => t.TicketDeductions)
          .HasForeignKey(td => td.TicketId)
          .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(td => td.Deduction)
          .WithMany(t => t.TicketDeductions)
          .HasForeignKey(td => td.DeductionId)
          .OnDelete(DeleteBehavior.SetNull);
        entity.Property(td => td.DeductionId)
          .IsRequired(false);
      });

      modelBuilder.Entity<TableWork>(entity =>
      {
        entity.HasKey(tw => tw.TableWorkId);
        entity.Property(tw => tw.Cta)
          .HasConversion(
            v => v.ToString(),
            v => (CtaOptions)Enum.Parse(typeof(CtaOptions), v));
      });

      base.OnModelCreating(modelBuilder);
    }

    public List<string> GetColumns<TEntity>() where TEntity : class
    {
      var entityType = Model.FindEntityType(typeof(TEntity));
      if(entityType == null) return [];

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

    public void GetColumns<TEntity>(TEntity ticket, List<string> columns) where TEntity : class
    {
      PropertyInfo[] properties = typeof(TEntity).GetProperties();
      foreach(var property in properties)
      {
        if(property.PropertyType.IsGenericType
          && typeof(IEnumerable<>).MakeGenericType(property.PropertyType.GetGenericArguments()).IsAssignableFrom(property.PropertyType) 
          && property.PropertyType != typeof(string)
          && property.Name != "Projects")
        {
          var value = property.GetValue(ticket);
          if (value is IEnumerable<object> relatedEntityList)
          {
            var method = typeof(DataContext).GetMethod("GetColumnsFromRelatedEntity", BindingFlags.NonPublic | BindingFlags.Static);
            if (method != null)
            {
              var genericMethod = method.MakeGenericMethod(property.PropertyType.GetGenericArguments()[0]);
              genericMethod.Invoke(null, [relatedEntityList, columns]);
            }
          }
        }
        else if(!columns.Contains(property.Name))
          columns.Add(property.Name);
      }
    }

    public T? GetEntityByName<T>(string name) where T : class
    {
      var entitySet = Set<T>().AsEnumerable();
      var nameProperty = typeof(T).GetProperty("Name") ?? typeof(T).GetProperty("Description");

      if(nameProperty == null) return null;
      return entitySet.FirstOrDefault(e => 
      {
        var propertyValue = nameProperty.GetValue(e)?.ToString();
        return propertyValue?.Trim().Equals(name, StringComparison.CurrentCultureIgnoreCase) == true;
      });
    }

    public bool AddRelatedEntities<TEntity ,TItemIdentifier, TDatabaseItem, TItem>(
      TEntity entity, HashSet<TItemIdentifier> itemIds,
      DbSet<TDatabaseItem> dbSet,
      Func<TEntity, TDatabaseItem, TItemIdentifier, TItem> createEntityItemFunc,
      ICollection<TItem> ticketItems)
      where TItemIdentifier : class
      where TDatabaseItem : class
      where TItem : class
      where TEntity : class
    {
      foreach (var item in itemIds)
      {
        var itemId = item.GetType().GetProperties()
          .FirstOrDefault(prop => prop.Name.Contains("Id"))
          ?.GetValue(item);

        if(itemId == null) return false;
        var dbItem = dbSet.Find(itemId);
        if (dbItem == null) return false;

        var entityItem = createEntityItemFunc(entity, dbItem, item);
        ticketItems.Add(entityItem);
        Add(entityItem);
      }

      return true;
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

    public bool RemoveRelatedEntities<TEntity, TRelatedEntity>(
      string entityId,
      Expression<Func<TEntity, IEnumerable<TRelatedEntity>>> navigationPropertySelector, 
      DbSet<TEntity> entitySet,
      DbSet<TRelatedEntity> relatedEntitySet)
      where TEntity : class
      where TRelatedEntity : class
    {
      var mainEntity = entitySet
        .Include(navigationPropertySelector)
        .AsEnumerable()
        .FirstOrDefault(e =>
        {
          var idProperty = e.GetType().GetProperties()
            .FirstOrDefault(prop => prop.Name.Contains("Id"));

          var id = idProperty?.GetValue(e)?.ToString();
          return id == entityId;
        });

      if(mainEntity == null) return false;
      var relatedEntities = navigationPropertySelector.Compile()(mainEntity);
      relatedEntitySet.RemoveRange(relatedEntities);
      return true;
    }

    public bool DeleteEntity<TEntity>(TEntity entity) where TEntity : class
    {
      Remove(entity);
      return Save();
    }

    private static void GetColumnsFromRelatedEntity<T>(HashSet<T> relatedEntityList, List<string> columns) where T : class
    {
      foreach(var entity in relatedEntityList)
      {
        var columnNameProperty = entity.GetType().GetProperties()
          .FirstOrDefault(prop => prop.Name == "Name");
        var columnValueProperty = entity.GetType().GetProperties()
          .FirstOrDefault(prop => prop.Name == "Value");

        var columnValue = columnValueProperty?.GetValue(entity);
        if (columnValue is float floatValue && floatValue > 0)
        {
          if(columnNameProperty?.GetValue(entity) is string columnName && !columns.Contains(columnName))
          {
            int totalIndex = columns.IndexOf("Total");
            if(totalIndex >= 0)
              columns.Insert(totalIndex, columnName);
            else
              columns.Add(columnName);
          }
        }
      }
    }

    private bool Save() => SaveChanges() > 0; 
  }
}