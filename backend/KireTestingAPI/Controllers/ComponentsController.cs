using Microsoft.AspNetCore.Mvc;
using KireTestingAPI.Data.Repositories;
using KireTestingAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KireTestingAPI.Controllers
{
    public class ComponentsController : BaseApiController<Component>
    {
        private readonly IComponentRepository _componentRepository;

        public ComponentsController(IComponentRepository repository) : base(repository)
        {
            _componentRepository = repository;
        }

        // Additional endpoints specific to components

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<Component>>> GetByProduct(int productId)
        {
            var components = await _componentRepository.GetByProductAsync(productId);
            return Ok(components);
        }

        [HttpGet("tenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<Component>>> GetByTenant(int tenantId)
        {
            var components = await _componentRepository.GetByTenantAsync(tenantId);
            return Ok(components);
        }

        [HttpGet("tenant/{tenantId}/enabled")]
        public async Task<ActionResult<IEnumerable<Component>>> GetEnabledByTenant(int tenantId)
        {
            var components = await _componentRepository.GetEnabledByTenantAsync(tenantId);
            return Ok(components);
        }
    }
}
