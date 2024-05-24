using Payroll.Models;

namespace Payroll.Interfaces
{
  public interface IContractRepository
  {
    ICollection<Contract> GetContracts();
    Contract GetContract(string contractId);
    bool CreateContract(Contract contract);
    bool UpdateContract(Contract contract);
    bool DeleteContract(Contract contract);
    bool ContractExists(string contractId);
  }
}