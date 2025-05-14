using Microsoft.AspNetCore.Mvc;
using KireTestingAPI.Data.Repositories;
using KireTestingAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KireTestingAPI.Controllers
{
    public class ProductsController : BaseApiController<Product>
    {
        private readonly IProductRepository _productRepository;

        public ProductsController(IProductRepository repository) : base(repository)
        {
            _productRepository = repository;
        }

        // Additional endpoints specific to products

        [HttpGet("team/{teamId}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetByTeam(int teamId)
        {
            var products = await _productRepository.GetByTeamAsync(teamId);
            return Ok(products);
        }

        [HttpGet("environment/{environmentId}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetByEnvironment(int environmentId)
        {
            var products = await _productRepository.GetByEnvironmentAsync(environmentId);
            return Ok(products);
        }

        [HttpGet("tenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetByTenant(int tenantId)
        {
            var products = await _productRepository.GetByTenantAsync(tenantId);
            return Ok(products);
        }

        [HttpGet("multi-tenant")]
        public async Task<ActionResult<IEnumerable<Product>>> GetMultiTenantProducts()
        {
            var products = await _productRepository.GetMultiTenantProductsAsync();
            return Ok(products);
        }

        [HttpGet("single-tenant")]
        public async Task<ActionResult<IEnumerable<Product>>> GetSingleTenantProducts()
        {
            var products = await _productRepository.GetSingleTenantProductsAsync();
            return Ok(products);
        }
    }
}
