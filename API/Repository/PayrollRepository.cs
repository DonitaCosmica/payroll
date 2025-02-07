using API.Data;
using API.Interfaces;
using API.Models;

namespace API.Repository
{
  public class PayrollTypeRepository(DataContext context) : IPayrollRepository
  {
    private readonly DataContext context = context;

    public ICollection<Payroll> GetPayrolls() => context.Payrolls.ToList();
    public Payroll GetPayroll(string payroll) => 
      context.Payrolls.FirstOrDefault(pr => pr.PayrollId == payroll)
      ?? throw new Exception("No Payroll with the specified id was found.");
    public Payroll GetPrincipalPayroll() =>
      context.Payrolls.FirstOrDefault(pr => pr.PayrollType == Enums.PayrollType.Principal)
      ?? throw new Exception("No Payroll with the specified id was found.");
    public Payroll? GetPayrollByName(string payrollName) => context.GetEntityByName<Payroll>(payrollName);
    public bool CreatePayroll(Payroll payroll) => context.CreateEntity(payroll);
    public bool UpdatePayroll(Payroll payroll) => context.UpdateEntity(payroll);
    public bool DeletePayroll(Payroll payroll) => context.DeleteEntity(payroll);
    public bool PayrollExists(string payrollId) => context.Payrolls.Any(pr => pr.PayrollId == payrollId);
    public bool PrimaryPayrollExists() => context.Payrolls.Any(pr => pr.PayrollType == Enums.PayrollType.Principal);
  }
}