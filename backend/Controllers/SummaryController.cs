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
    public class SummaryController : ControllerBase
    {
        private readonly MessContext _context;

        public SummaryController(MessContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<SummaryDto>> GetSummary()
        {
            var users = await _context.Users.Where(u => u.Status == "Active").ToListAsync();
            var deposits = await _context.Deposits.ToListAsync();
            var meals = await _context.Meals.ToListAsync();
            var bazarCosts = await _context.BazarCosts.ToListAsync();
            var extraCosts = await _context.ExtraCosts.ToListAsync();

            var totalDeposit = deposits.Sum(d => d.Amount);
            var totalMeal = meals.Sum(m => m.MealCount);
            var totalBazarCost = bazarCosts.Sum(b => b.Amount);
            var totalExtraCost = extraCosts.Sum(e => e.Amount);
            var totalCost = totalBazarCost + totalExtraCost;

            decimal mealRate = 0;
            if (totalMeal > 0)
            {
                // Meal Rate = (Total Bazar Cost + Extra Cost) / Total Meal
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
    }
}
