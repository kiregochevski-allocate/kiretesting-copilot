using Microsoft.AspNetCore.Mvc;
using KireTestingAPI.Data.Repositories;
using KireTestingAPI.Models;

namespace KireTestingAPI.Controllers
{
    public class AwsAccountsController : BaseApiController<AwsAccount>
    {
        public AwsAccountsController(IRepository<AwsAccount> repository) : base(repository)
        {
        }
    }
}
