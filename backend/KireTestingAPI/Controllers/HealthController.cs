using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace KireTestingAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("Health check executed at {time}", DateTime.UtcNow);
            return Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });
        }
        
        [HttpGet("readiness")]
        public async Task<IActionResult> ReadinessCheck()
        {
            try
            {
                // Add database connectivity check if needed
                // await _dbContext.Database.CanConnectAsync();
                
                return Ok(new { status = "Ready", timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Readiness check failed");
                return StatusCode(503, new { status = "Not Ready", error = ex.Message });
            }
        }
        
        [HttpGet("liveness")]
        public IActionResult LivenessCheck()
        {
            return Ok(new { status = "Alive", timestamp = DateTime.UtcNow });
        }
    }
}
