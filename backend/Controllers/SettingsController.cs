using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly MessContext _context;

        public SettingsController(MessContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<SystemSettings>> GetSettings()
        {
            var settings = await _context.SystemSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new SystemSettings();
                _context.SystemSettings.Add(settings);
                await _context.SaveChangesAsync();
            }
            return Ok(settings);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SystemSettings>> UpdateSettings([FromBody] SystemSettings updatedSettings)
        {
            var settings = await _context.SystemSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new SystemSettings();
                _context.SystemSettings.Add(settings);
            }

            settings.Process = updatedSettings.Process;
            settings.BkashNumber = updatedSettings.BkashNumber;
            settings.NagadNumber = updatedSettings.NagadNumber;
            settings.WhatsappNumber = updatedSettings.WhatsappNumber;

            await _context.SaveChangesAsync();

            return Ok(settings);
        }
    }
}
