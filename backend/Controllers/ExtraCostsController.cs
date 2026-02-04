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
    public class ExtraCostsController : ControllerBase
    {
        private readonly MessContext _context;

        public ExtraCostsController(MessContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExtraCost>>> GetExtraCosts()
        {
            return await _context.ExtraCosts.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExtraCost>> GetExtraCost(int id)
        {
            var extraCost = await _context.ExtraCosts.FindAsync(id);

            if (extraCost == null)
            {
                return NotFound();
            }

            return extraCost;
        }

        [HttpPost]
        public async Task<ActionResult<ExtraCost>> PostExtraCost(ExtraCost extraCost)
        {
            _context.ExtraCosts.Add(extraCost);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExtraCost), new { id = extraCost.Id }, extraCost);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExtraCost(int id, ExtraCost extraCost)
        {
            if (id != extraCost.Id)
            {
                return BadRequest();
            }

            _context.Entry(extraCost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExtraCostExists(id))
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
        public async Task<IActionResult> DeleteExtraCost(int id)
        {
            var extraCost = await _context.ExtraCosts.FindAsync(id);
            if (extraCost == null)
            {
                return NotFound();
            }

            _context.ExtraCosts.Remove(extraCost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExtraCostExists(int id)
        {
            return _context.ExtraCosts.Any(e => e.Id == id);
        }
    }
}
