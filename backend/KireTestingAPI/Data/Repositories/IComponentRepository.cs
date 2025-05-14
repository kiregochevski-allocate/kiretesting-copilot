using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using KireTestingAPI.Models;

namespace KireTestingAPI.Data.Repositories
{
    public interface IComponentRepository : IRepository<Component>
    {
        Task<IEnumerable<Component>> GetByProductAsync(int productId);
        Task<IEnumerable<Component>> GetByTenantAsync(int tenantId);
        Task<IEnumerable<Component>> GetEnabledByTenantAsync(int tenantId);
    }
}
