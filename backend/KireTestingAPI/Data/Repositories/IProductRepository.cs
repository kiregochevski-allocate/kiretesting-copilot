using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using KireTestingAPI.Models;

namespace KireTestingAPI.Data.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetByTeamAsync(int teamId);
        Task<IEnumerable<Product>> GetByEnvironmentAsync(int environmentId);
        Task<IEnumerable<Product>> GetByTenantAsync(int tenantId);
        Task<IEnumerable<Product>> GetMultiTenantProductsAsync();
        Task<IEnumerable<Product>> GetSingleTenantProductsAsync();
    }
}
