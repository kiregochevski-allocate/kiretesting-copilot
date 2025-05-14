using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using KireTestingAPI.Models.Security;

namespace KireTestingAPI.Data.Repositories.Security
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetByTeamAsync(int teamId);
        Task<IEnumerable<User>> GetByRoleAsync(int roleId);
    }
}
