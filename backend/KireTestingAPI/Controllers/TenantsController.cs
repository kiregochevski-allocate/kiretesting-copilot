using Microsoft.AspNetCore.Mvc;
using KireTestingAPI.Data.Repositories;
using KireTestingAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KireTestingAPI.Controllers
{
    public class TenantsController : BaseApiController<Tenant>
    {
        private readonly ITenantRepository _tenantRepository;

        public TenantsController(ITenantRepository repository) : base(repository)
        {
            _tenantRepository = repository;
        }

        // Additional endpoints specific to tenants

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Tenant>>> GetActiveTenants()
        {
            var tenants = await _tenantRepository.GetActiveTenantsAsync();
            return Ok(tenants);
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<Tenant>>> GetByProduct(int productId)
        {
            var tenants = await _tenantRepository.GetByProductAsync(productId);
            return Ok(tenants);
        }
    }
}
