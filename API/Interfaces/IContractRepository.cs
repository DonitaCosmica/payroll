using API.Models;

namespace API.Interfaces
{
  public interface IContractRepository
  {
    ICollection<Contract> GetContracts();
    Contract GetContract(string contractId);
    Contract? GetContractByName(string contractName);
    bool CreateContract(Contract contract);
    bool UpdateContract(Contract contract);
    bool DeleteContract(Contract contract);
    bool ContractExists(string contractId);
  }
}