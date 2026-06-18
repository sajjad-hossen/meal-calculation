using Microsoft.AspNetCore.Authorization;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessController : ControllerBase
    {
        private readonly MessContext _context;

        public MessController(MessContext context)
        {
            _context = context;
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            var messId = _context.CurrentMessId;
            if (!messId.HasValue) return NotFound();

            var mess = await _context.Messes.FindAsync(messId.Value);
            if (mess == null) return NotFound();

            var currentMonth = DateTime.UtcNow.ToString("yyyy-MM");
            var isPaid = mess.LastPaidMonth == currentMonth;

            return Ok(new { isPaidForCurrentMonth = isPaid });
        }
    }
}
