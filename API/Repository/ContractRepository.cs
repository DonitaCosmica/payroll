using API.Models;
using API.Data;
using API.Interfaces;

namespace API.Repository
{
  public class ContractRepository(DataContext context) : IContractRepository
  {
    private readonly DataContext context = context;

    public ICollection<Contract> GetContracts() => context.Contracts.ToList();
    public Contract GetContract(string contractId) => context.Contracts.Where(ct => ct.ContractId == contractId).FirstOrDefault() ??
      throw new Exception("No Contract with the specified id was found");
    public Contract? GetContractByName(string contractName) => context.GetEntityByName<Contract>(contractName);
    public bool CreateContract(Contract contract) => context.CreateEntity(contract);
    public bool UpdateContract(Contract contract) => context.UpdateEntity(contract);
    public bool DeleteContract(Contract contract) => context.DeleteEntity(contract);
    public bool ContractExists(string contractId) => context.Contracts.Any(ct => ct.ContractId == contractId);
  }
}