using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using KireTestingAPI.Models;

namespace KireTestingAPI.Data.Repositories
{
    public interface ITenantRepository : IRepository<Tenant>
    {
        Task<IEnumerable<Tenant>> GetActiveTenantsAsync();
        Task<IEnumerable<Tenant>> GetByProductAsync(int productId);
    }
}
