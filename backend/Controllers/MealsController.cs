using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealsController : ControllerBase
    {
        private readonly MessContext _context;

        public MealsController(MessContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MealEntry>>> GetMeals([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.Meals.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(m => m.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(m => m.Date <= endDate.Value);
            }

            return await query.Include(m => m.User).OrderBy(m => m.Date).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<MealEntry>> PostMeal(MealEntry meal)
        {
            // Check if entry already exists for this user and date
            var existingMeal = await _context.Meals
                .FirstOrDefaultAsync(m => m.UserId == meal.UserId && m.Date.Date == meal.Date.Date);

            if (existingMeal != null)
            {
                existingMeal.MealCount = meal.MealCount;
                await _context.SaveChangesAsync();
                return Ok(existingMeal);
            }

            _context.Meals.Add(meal);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMeals), new { id = meal.Id }, meal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMeal(int id, MealEntry meal)
        {
            if (id != meal.Id)
            {
                return BadRequest();
            }

            _context.Entry(meal).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeal(int id)
        {
            var meal = await _context.Meals.FindAsync(id);
            if (meal == null)
            {
                return NotFound();
            }

            _context.Meals.Remove(meal);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
