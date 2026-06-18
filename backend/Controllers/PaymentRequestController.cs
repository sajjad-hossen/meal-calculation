using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Services;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Manager")]
    public class PaymentRequestController : ControllerBase
    {
        private readonly MessContext _context;
        private readonly ITenantService _tenantService;

        public PaymentRequestController(MessContext context, ITenantService tenantService)
        {
            _context = context;
            _tenantService = tenantService;
        }

        // POST /api/PaymentRequest — submit a payment request
        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] SubmitPaymentRequestDto dto)
        {
            var messId = _tenantService.GetMessId();
            if (messId == null) return Unauthorized();

            // Block if already paid this month
            var mess = await _context.Messes.FindAsync(messId.Value);
            if (mess == null) return NotFound("Mess not found.");

            var currentMonth = DateTime.UtcNow.ToString("yyyy-MM");
            if (mess.LastPaidMonth == currentMonth)
                return BadRequest("Your mess is already paid for this month.");

            // Block duplicate pending request
            var alreadyPending = await _context.PaymentRequests
                .IgnoreQueryFilters()
                .AnyAsync(r => r.MessId == messId.Value && r.Status == "Pending");

            if (alreadyPending)
                return BadRequest("You already have a pending payment request. Please wait for admin approval.");

            var request = new PaymentRequest
            {
                MessId = messId.Value,
                ManagerEmail = dto.ManagerEmail,
                TransactionId = dto.TransactionId,
                Note = dto.Note,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.PaymentRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment request submitted successfully. Admin will review shortly." });
        }

        // GET /api/PaymentRequest/my-status — check if there's a pending request
        [HttpGet("my-status")]
        public async Task<IActionResult> MyStatus()
        {
            var messId = _tenantService.GetMessId();
            if (messId == null) return Unauthorized();

            var pending = await _context.PaymentRequests
                .IgnoreQueryFilters()
                .Where(r => r.MessId == messId.Value && r.Status == "Pending")
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            return Ok(new { hasPending = pending != null });
        }
    }
}
