using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using KireTestingAPI.Models;

namespace KireTestingAPI.Data.Repositories
{
    public class TenantRepository : Repository<Tenant>, ITenantRepository
    {
        public TenantRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Tenant>> GetAllAsync()
        {
            return await _dbSet
                .Include(t => t.TenantProducts)
                    .ThenInclude(tp => tp.Product)
                .ToListAsync();
        }

        public override async Task<Tenant?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(t => t.TenantProducts)
                    .ThenInclude(tp => tp.Product)
                .Include(t => t.TenantComponents)
                    .ThenInclude(tc => tc.Component)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<Tenant>> GetActiveTenantsAsync()
        {
            return await _dbSet
                .Where(t => t.IsActive)
                .ToListAsync();
        }

        public async Task<IEnumerable<Tenant>> GetByProductAsync(int productId)
        {
            return await _context.TenantProducts
                .Where(tp => tp.ProductId == productId && tp.IsActive)
                .Include(tp => tp.Tenant)
                .Select(tp => tp.Tenant)
                .ToListAsync();
        }
    }
}
