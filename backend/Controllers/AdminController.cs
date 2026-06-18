using Microsoft.AspNetCore.Authorization;
using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly MessContext _context;

        public AdminController(MessContext context)
        {
            _context = context;
        }

        [HttpGet("messes-summary")]
        public async Task<ActionResult<AdminSummaryDto>> GetMessesSummary()
        {
            // Fetch all messes
            var messes = await _context.Messes.ToListAsync();

            // Fetch users mapping ignoring tenancy filters
            // We ignore query filters so we can calculate count across all tenants.
            // Also we only count non-deleted users and exclude the system Admin itself.
            var users = await _context.Users
                .IgnoreQueryFilters()
                .Where(u => u.Status != "Deleted" && u.Role != "Admin")
                .ToListAsync();

            var messMemberCounts = users
                .GroupBy(u => u.MessId)
                .Select(g => new { MessId = g.Key, Count = g.Count() })
                .ToList();

            // Get the Manager email for each mess
            var managerEmails = users
                .Where(u => u.Role == "Manager")
                .GroupBy(u => u.MessId)
                .ToDictionary(g => g.Key, g => g.First().Email);

            var countDict = messMemberCounts.ToDictionary(x => x.MessId, x => x.Count);

            var messSummaries = messes.Select(m => new MessSummaryDto
            {
                Id = m.Id,
                Name = m.Name,
                UniqueCode = m.UniqueCode,
                ManagerEmail = managerEmails.ContainsKey(m.Id) ? managerEmails[m.Id] : null,
                CreatedAt = m.CreatedAt,
                MemberCount = countDict.ContainsKey(m.Id) ? countDict[m.Id] : 0,
                LastPaidMonth = m.LastPaidMonth
            }).ToList();

            var totalMembers = messSummaries.Sum(m => m.MemberCount);

            var summary = new AdminSummaryDto
            {
                TotalMesses = messSummaries.Count,
                TotalMembers = totalMembers,
                Messes = messSummaries
            };

            return Ok(summary);
        }

        [HttpPost("toggle-payment/{id}")]
        public async Task<IActionResult> TogglePayment(int id)
        {
            var mess = await _context.Messes.FindAsync(id);
            if (mess == null) return NotFound();

            var currentMonth = System.DateTime.UtcNow.ToString("yyyy-MM");
            if (mess.LastPaidMonth == currentMonth)
            {
                mess.LastPaidMonth = null;
            }
            else
            {
                mess.LastPaidMonth = currentMonth;
            }

            await _context.SaveChangesAsync();
            return Ok(new { lastPaidMonth = mess.LastPaidMonth });
        }

        // GET /api/Admin/payment-requests — all pending payment requests
        [HttpGet("payment-requests")]
        public async Task<ActionResult<List<PaymentRequestDto>>> GetPaymentRequests()
        {
            var requests = await _context.PaymentRequests
                .Include(r => r.Mess)
                .Where(r => r.Status == "Pending")
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new PaymentRequestDto
                {
                    Id = r.Id,
                    MessId = r.MessId,
                    MessName = r.Mess.Name,
                    ManagerEmail = r.ManagerEmail,
                    TransactionId = r.TransactionId,
                    Note = r.Note,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(requests);
        }

        // POST /api/Admin/payment-requests/{id}/approve
        [HttpPost("payment-requests/{id}/approve")]
        public async Task<IActionResult> ApprovePaymentRequest(int id)
        {
            var request = await _context.PaymentRequests.Include(r => r.Mess).FirstOrDefaultAsync(r => r.Id == id);
            if (request == null) return NotFound();

            request.Status = "Approved";

            // Mark the mess as paid for this month
            var currentMonth = System.DateTime.UtcNow.ToString("yyyy-MM");
            request.Mess.LastPaidMonth = currentMonth;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Payment approved and mess marked as paid." });
        }

        // POST /api/Admin/payment-requests/{id}/reject
        [HttpPost("payment-requests/{id}/reject")]
        public async Task<IActionResult> RejectPaymentRequest(int id)
        {
            var request = await _context.PaymentRequests.FirstOrDefaultAsync(r => r.Id == id);
            if (request == null) return NotFound();

            request.Status = "Rejected";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Payment request rejected." });
        }
    }
}
