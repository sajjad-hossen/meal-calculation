using Microsoft.AspNetCore.Authorization;
using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SummaryController : ControllerBase
    {
        private readonly MessContext _context;

        public SummaryController(MessContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<SummaryDto>> GetSummary([FromQuery] int? month, [FromQuery] int? year)
        {
            var users = await _context.Users.Where(u => u.Status == "Active" && u.IsCalculationMember).ToListAsync();

            var depositsQuery = _context.Deposits.AsQueryable();
            var mealsQuery = _context.Meals.AsQueryable();
            var bazarCostsQuery = _context.BazarCosts.AsQueryable();

            if (month.HasValue && year.HasValue)
            {
                depositsQuery = depositsQuery.Where(d => d.Date.Month == month.Value && d.Date.Year == year.Value);
                mealsQuery = mealsQuery.Where(m => m.Date.Month == month.Value && m.Date.Year == year.Value);
                bazarCostsQuery = bazarCostsQuery.Where(b => b.Date.Month == month.Value && b.Date.Year == year.Value);
            }

            var deposits = await depositsQuery.ToListAsync();
            var meals = await mealsQuery.ToListAsync();
            var bazarCosts = await bazarCostsQuery.ToListAsync();

            var totalDeposit = deposits.Sum(d => d.Amount);
            var totalMeal = meals.Sum(m => m.MealCount);
            var totalBazarCost = bazarCosts.Sum(b => b.Amount);
            var totalCost = totalBazarCost;

            decimal mealRate = 0;
            if (totalMeal > 0)
            {
                // Meal Rate = Total Bazar Cost / Total Meal
                mealRate = totalCost / (decimal)totalMeal;
            }

            var userSummaries = users.Select(user =>
            {
                var userDeposit = deposits.Where(d => d.UserId == user.Id).Sum(d => d.Amount);
                var userMeal = meals.Where(m => m.UserId == user.Id).Sum(m => m.MealCount);
                
                var mealCost = (decimal)userMeal * mealRate;
                var balance = userDeposit - mealCost;

                return new UserSummaryDto
                {
                    UserId = user.Id,
                    Name = user.Name,
                    TotalDeposit = userDeposit,
                    TotalMeal = userMeal,
                    MealCost = Math.Round(mealCost, 2),
                    Balance = Math.Round(balance, 2)
                };
            }).ToList();

            var summary = new SummaryDto
            {
                TotalMembers = users.Count,
                TotalDeposit = totalDeposit,
                TotalMeal = totalMeal,
                TotalCost = totalCost,
                MealRate = Math.Round(mealRate, 2),
                UserSummaries = userSummaries
            };

            return Ok(summary);
        }

        [HttpGet("available-months")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableMonths()
        {
            var depositMonths = await _context.Deposits
                .Select(d => new { d.Date.Year, d.Date.Month })
                .Distinct()
                .ToListAsync();

            var mealMonths = await _context.Meals
                .Select(m => new { m.Date.Year, m.Date.Month })
                .Distinct()
                .ToListAsync();

            var bazarMonths = await _context.BazarCosts
                .Select(b => new { b.Date.Year, b.Date.Month })
                .Distinct()
                .ToListAsync();

            var allMonths = depositMonths
                .Concat(mealMonths)
                .Concat(bazarMonths)
                .Distinct()
                .OrderByDescending(x => x.Year)
                .ThenByDescending(x => x.Month)
                .Select(x => new { month = x.Month, year = x.Year })
                .ToList();

            return Ok(allMonths);
        }
    }
}
