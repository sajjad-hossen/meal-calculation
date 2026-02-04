using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BazarCostsController : ControllerBase
    {
        private readonly MessContext _context;

        public BazarCostsController(MessContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BazarCost>>> GetBazarCosts()
        {
            return await _context.BazarCosts.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BazarCost>> GetBazarCost(int id)
        {
            var bazarCost = await _context.BazarCosts.FindAsync(id);

            if (bazarCost == null)
            {
                return NotFound();
            }

            return bazarCost;
        }

        [HttpPost]
        public async Task<ActionResult<BazarCost>> PostBazarCost(BazarCost bazarCost)
        {
            _context.BazarCosts.Add(bazarCost);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBazarCost), new { id = bazarCost.Id }, bazarCost);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBazarCost(int id, BazarCost bazarCost)
        {
            if (id != bazarCost.Id)
            {
                return BadRequest();
            }

            _context.Entry(bazarCost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BazarCostExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBazarCost(int id)
        {
            var bazarCost = await _context.BazarCosts.FindAsync(id);
            if (bazarCost == null)
            {
                return NotFound();
            }

            _context.BazarCosts.Remove(bazarCost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BazarCostExists(int id)
        {
            return _context.BazarCosts.Any(e => e.Id == id);
        }
    }
}
