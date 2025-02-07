using API.Models;

namespace API.Interfaces
{
  public interface IPayrollRepository
  {
    ICollection<Payroll> GetPayrolls();
    Payroll GetPayroll(string payrollId);
    Payroll GetPrincipalPayroll();
    Payroll? GetPayrollByName(string payrollName);
    bool CreatePayroll(Payroll payroll);
    bool UpdatePayroll(Payroll payroll);
    bool DeletePayroll(Payroll payroll);
    bool PayrollExists(string payrollId);
    bool PrimaryPayrollExists();
  }
}