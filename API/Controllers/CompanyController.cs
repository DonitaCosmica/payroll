using Microsoft.AspNetCore.Mvc;
using Payroll.DTO;
using Payroll.Interfaces;
using Payroll.Models;

namespace  Payroll.Controllers
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
      var companies = companyRepository.GetCompanies()
        .Select(c => new CompanyDTO
        {
          CompanyId = c.CompanyId,
          Name = c.Name
        });

      return Ok(companies);
    }

    [HttpGet("{companyId}")]
    [ProducesResponseType(200, Type = typeof(CompanyDTO))]
    [ProducesResponseType(400)]
    public IActionResult GetCompany(string companyId)
    {
      if(!companyRepository.CompanyExists(companyId))
        return NotFound();

      var company = companyRepository.GetCompany(companyId);
      var companyDTO = new CompanyDTO
      {
        CompanyId = company.CompanyId,
        Name = company.Name
      };

      return Ok(companyDTO);
    }

    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public IActionResult CreateCompany([FromBody] CompanyDTO companyCreate)
    {
      if(companyCreate == null)
        return BadRequest();

      var existingCompany = companyRepository.GetCompanies()
        .FirstOrDefault(c => c.Name.Trim().Equals(companyCreate.Name.Trim(), StringComparison.CurrentCultureIgnoreCase));

      if(existingCompany != null)
        return Conflict("Company already exists");

      var company = new Company
      {
        CompanyId = Guid.NewGuid().ToString(),
        Name = companyCreate.Name
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
      if(companyUpdate == null || companyId != companyUpdate.CompanyId)
        return BadRequest();

      if(!companyRepository.CompanyExists(companyId))
        return NotFound();

      var company = companyRepository.GetCompany(companyId);

      if(companyUpdate.Name != null)
        company.Name = companyUpdate.Name;

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

      var companyToDelete = companyRepository.GetCompany(companyId);

      if(!companyRepository.DeleteCompany(companyToDelete))
        return StatusCode(500, "Something went wrong deleting company");

      return NoContent();
    }
  }
}