using Microsoft.EntityFrameworkCore;
using KireTestingAPI.Models;
using KireTestingAPI.Models.Security;

namespace KireTestingAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Security schema entities
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Privilege> Privileges { get; set; }
        public DbSet<RolePrivilege> RolePrivileges { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<UserTeam> UserTeams { get; set; }
        public DbSet<Module> Modules { get; set; }

        // Application entities
        public DbSet<Models.Environment> Environments { get; set; }
        public DbSet<AwsAccount> AwsAccounts { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Component> Components { get; set; }
        public DbSet<ProductEnvironment> ProductEnvironments { get; set; }
        public DbSet<TenantProduct> TenantProducts { get; set; }
        public DbSet<TenantComponent> TenantComponents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure entity relationships and constraints

            // User-Role Many-to-Many relationship
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => ur.Id);
            modelBuilder.Entity<UserRole>()
                .HasIndex(ur => new { ur.UserId, ur.RoleId })
                .IsUnique();

            // Role-Privilege Many-to-Many relationship
            modelBuilder.Entity<RolePrivilege>()
                .HasKey(rp => rp.Id);
            modelBuilder.Entity<RolePrivilege>()
                .HasIndex(rp => new { rp.RoleId, rp.PrivilegeId })
                .IsUnique();

            // User-Team Many-to-Many relationship
            modelBuilder.Entity<UserTeam>()
                .HasKey(ut => ut.Id);
            modelBuilder.Entity<UserTeam>()
                .HasIndex(ut => new { ut.UserId, ut.TeamId })
                .IsUnique();

            // Product-Environment relationship
            modelBuilder.Entity<ProductEnvironment>()
                .HasKey(pe => pe.Id);
            modelBuilder.Entity<ProductEnvironment>()
                .HasIndex(pe => new { pe.ProductId, pe.EnvironmentId })
                .IsUnique();

            // Tenant-Product relationship
            modelBuilder.Entity<TenantProduct>()
                .HasKey(tp => tp.Id);
            modelBuilder.Entity<TenantProduct>()
                .HasIndex(tp => new { tp.TenantId, tp.ProductId })
                .IsUnique();

            // Tenant-Component relationship
            modelBuilder.Entity<TenantComponent>()
                .HasKey(tc => tc.Id);
            modelBuilder.Entity<TenantComponent>()
                .HasIndex(tc => new { tc.TenantId, tc.ComponentId })
                .IsUnique();

            // Add seed data for environments
            modelBuilder.Entity<Models.Environment>().HasData(
                new Models.Environment { 
                    Id = 1, 
                    Code = "DEV", 
                    Name = "Development", 
                    Description = "Development Environment",
                    CreatedBy = "System",
                    CreatedDate = System.DateTime.Now,
                    ModifiedBy = "System",
                    ModifiedDate = System.DateTime.Now
                },
                new Models.Environment { 
                    Id = 2, 
                    Code = "TEST", 
                    Name = "Test", 
                    Description = "Testing Environment",
                    CreatedBy = "System",
                    CreatedDate = System.DateTime.Now,
                    ModifiedBy = "System",
                    ModifiedDate = System.DateTime.Now
                },
                new Models.Environment { 
                    Id = 3, 
                    Code = "PREPROD", 
                    Name = "Pre-Production", 
                    Description = "Pre-Production Environment",
                    CreatedBy = "System",
                    CreatedDate = System.DateTime.Now,
                    ModifiedBy = "System",
                    ModifiedDate = System.DateTime.Now
                },
                new Models.Environment { 
                    Id = 4, 
                    Code = "PROD", 
                    Name = "Production", 
                    Description = "Production Environment",
                    CreatedBy = "System",
                    CreatedDate = System.DateTime.Now,
                    ModifiedBy = "System",
                    ModifiedDate = System.DateTime.Now
                }
            );

            // Add seed data for admin role
            modelBuilder.Entity<Role>().HasData(
                new Role { 
                    Id = 1, 
                    Code = "ADMIN", 
                    Name = "Administrator", 
                    Description = "Full system access",
                    CreatedBy = "System",
                    CreatedDate = System.DateTime.Now,
                    ModifiedBy = "System",
                    ModifiedDate = System.DateTime.Now
                }
            );

            // Add seed data for admin user
            modelBuilder.Entity<User>().HasData(
                new User { 
                    Id = 1, 
                    Code = "ADMIN", 
                    Name = "System Administrator", 
                    Email = "admin@example.com",
                    Password = "hashedpassword123", // Would be properly hashed in production
                    IsActive = true,
                    CreatedBy = "System",
                    CreatedDate = System.DateTime.Now,
                    ModifiedBy = "System",
                    ModifiedDate = System.DateTime.Now
                }
            );

            // Add seed data for admin user-role
            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { 
                    Id = 1, 
                    UserId = 1, 
                    RoleId = 1,
                    CreatedBy = "System",
                    CreatedDate = System.DateTime.Now,
                    ModifiedBy = "System",
                    ModifiedDate = System.DateTime.Now
                }
            );
        }
    }
}