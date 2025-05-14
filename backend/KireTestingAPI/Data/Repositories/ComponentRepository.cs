using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using KireTestingAPI.Models;

namespace KireTestingAPI.Data.Repositories
{
    public class ComponentRepository : Repository<Component>, IComponentRepository
    {
        public ComponentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Component>> GetAllAsync()
        {
            return await _dbSet
                .Include(c => c.Product)
                .ToListAsync();
        }

        public override async Task<Component?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(c => c.Product)
                .Include(c => c.TenantComponents)
                    .ThenInclude(tc => tc.Tenant)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Component>> GetByProductAsync(int productId)
        {
            return await _dbSet
                .Where(c => c.ProductId == productId)
                .Include(c => c.Product)
                .ToListAsync();
        }

        public async Task<IEnumerable<Component>> GetByTenantAsync(int tenantId)
        {
            return await _context.TenantComponents
                .Where(tc => tc.TenantId == tenantId)
                .Include(tc => tc.Component)
                    .ThenInclude(c => c.Product)
                .Select(tc => tc.Component)
                .ToListAsync();
        }

        public async Task<IEnumerable<Component>> GetEnabledByTenantAsync(int tenantId)
        {
            return await _context.TenantComponents
                .Where(tc => tc.TenantId == tenantId && tc.IsActive)
                .Include(tc => tc.Component)
                    .ThenInclude(c => c.Product)
                .Select(tc => tc.Component)
                .ToListAsync();
        }
    }
}
