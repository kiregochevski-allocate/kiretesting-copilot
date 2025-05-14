using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using KireTestingAPI.Models;

namespace KireTestingAPI.Data.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _dbSet
                .Include(p => p.Team)
                .ToListAsync();
        }

        public override async Task<Product?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Team)
                .Include(p => p.Components)
                .Include(p => p.ProductEnvironments)
                    .ThenInclude(pe => pe.Environment)
                .Include(p => p.ProductEnvironments)
                    .ThenInclude(pe => pe.AwsAccount)
                .Include(p => p.TenantProducts)
                    .ThenInclude(tp => tp.Tenant)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Product>> GetByTeamAsync(int teamId)
        {
            return await _dbSet
                .Include(p => p.Team)
                .Where(p => p.TeamId == teamId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByEnvironmentAsync(int environmentId)
        {
            return await _context.ProductEnvironments
                .Where(pe => pe.EnvironmentId == environmentId)
                .Include(pe => pe.Product)
                    .ThenInclude(p => p.Team)
                .Select(pe => pe.Product)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByTenantAsync(int tenantId)
        {
            return await _context.TenantProducts
                .Where(tp => tp.TenantId == tenantId && tp.IsActive)
                .Include(tp => tp.Product)
                    .ThenInclude(p => p.Team)
                .Select(tp => tp.Product)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetMultiTenantProductsAsync()
        {
            return await _dbSet
                .Where(p => p.IsMultiTenant)
                .Include(p => p.Team)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetSingleTenantProductsAsync()
        {
            return await _dbSet
                .Where(p => !p.IsMultiTenant)
                .Include(p => p.Team)
                .ToListAsync();
        }
    }
}
