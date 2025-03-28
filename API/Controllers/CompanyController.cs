using Microsoft.AspNetCore.Mvc;
using API.DTO;
using API.Interfaces;
using API.Models;

namespace  API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CompanyController(ICompanyRepository companyRepository) : Controller
  {
    private readonly ICompanyRepository companyRepository = companyRepository;

    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<CompanyDTO>))]
    public IActionResult GetCompanies()
    {
      List<CompanyDTO> companies = [.. companyRepository.GetCompanies()
        .Select(c => new CompanyDTO
        {
          CompanyId = c.CompanyId,
          Name = c.Name,
          TotalWorkers = c.TotalWorkers
        })];

      List<string> columns = companyRepository.GetColumns();
      var result = new
      {
        Columns = columns,
        FormColumns = columns,
        Data = companies,
        FormData = companies
      };

      return Ok(result);
    }

    [HttpGet("{companyId}")]
    [ProducesResponseType(200, Type = typeof(CompanyDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetCompany(string companyId)
    {
      if(!companyRepository.CompanyExists(companyId))
        return NotFound();

      Company company = companyRepository.GetCompany(companyId);
      CompanyDTO companyDTO = new()
      {
        CompanyId = company.CompanyId,
        Name = company.Name,
        TotalWorkers = company.TotalWorkers
      };

      return Ok(companyDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateCompany([FromBody] CompanyDTO companyCreate)
    {
      if(companyCreate == null ||  string.IsNullOrEmpty(companyCreate.Name))
        return BadRequest();

      if(companyRepository.GetCompanyByName(companyCreate.Name.Trim()) != null)
        return Conflict("Company already exists");

      Company company = new()
      {
        CompanyId = Guid.NewGuid().ToString(),
        Name = companyCreate.Name,
        TotalWorkers = 0
      };

      if(!companyRepository.CreateCompany(company))
        return StatusCode(500, "Something went wrong while saving");

      return NoContent();
    }

    [HttpPatch("{companyId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateCompany(string companyId, [FromBody] CompanyDTO companyUpdate)
    {
      if(companyUpdate == null || companyUpdate.TotalWorkers < 0 || string.IsNullOrEmpty(companyUpdate.Name))
        return BadRequest();

      if(!companyRepository.CompanyExists(companyId))
        return NotFound();

      Company company = companyRepository.GetCompany(companyId);
      company.Name = companyUpdate.Name;
      company.TotalWorkers = companyUpdate.TotalWorkers;

      if(!companyRepository.UpdateCompany(company))
        return StatusCode(500, "Something went wrong updating company");

      return NoContent();
    }

    [HttpDelete("{companyId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult DeleteCompany(string companyId)
    {
      if(!companyRepository.CompanyExists(companyId))
        return NotFound();

      Company companyToDelete = companyRepository.GetCompany(companyId);
      if(!companyRepository.DeleteCompany(companyToDelete))
        return StatusCode(500, "Something went wrong deleting company");

      return NoContent();
    }
  }
}