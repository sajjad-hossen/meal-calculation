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
    public class DepositsController : ControllerBase
    {
        private readonly MessContext _context;

        public DepositsController(MessContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Deposit>>> GetDeposits()
        {
            return await _context.Deposits.Include(d => d.User).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Deposit>> GetDeposit(int id)
        {
            var deposit = await _context.Deposits.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);

            if (deposit == null)
            {
                return NotFound();
            }

            return deposit;
        }

        [HttpPost]
        public async Task<ActionResult<Deposit>> PostDeposit(Deposit deposit)
        {
            _context.Deposits.Add(deposit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDeposit), new { id = deposit.Id }, deposit);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeposit(int id, Deposit deposit)
        {
            if (id != deposit.Id)
            {
                return BadRequest();
            }

            _context.Entry(deposit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepositExists(id))
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
        public async Task<IActionResult> DeleteDeposit(int id)
        {
            var deposit = await _context.Deposits.FindAsync(id);
            if (deposit == null)
            {
                return NotFound();
            }

            _context.Deposits.Remove(deposit);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DepositExists(int id)
        {
            return _context.Deposits.Any(e => e.Id == id);
        }
    }
}
