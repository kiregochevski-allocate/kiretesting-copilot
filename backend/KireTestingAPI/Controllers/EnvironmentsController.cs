using Microsoft.AspNetCore.Mvc;
using KireTestingAPI.Data.Repositories;
using KireTestingAPI.Models;
using System;

namespace KireTestingAPI.Controllers
{
    public class EnvironmentsController : BaseApiController<Models.Environment>
    {
        public EnvironmentsController(IRepository<Models.Environment> repository) : base(repository)
        {
        }
    }
}
