using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MessContext _context;
        private readonly TokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(MessContext context, TokenService tokenService, IEmailService emailService, ILogger<AuthController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            if (await _context.Users.IgnoreQueryFilters().AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email already exists.");
            }

            // Create new Mess
            var mess = new Mess
            {
                Name = request.MessName
            };
            _context.Messes.Add(mess);
            await _context.SaveChangesAsync();

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Manager", // The person who creates the mess is the manager
                Status = "Active",
                MessId = mess.Id,
                IsCalculationMember = false, // Manager can add themselves as member later if needed
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User and Mess registered successfully", messCode = mess.UniqueCode });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
        {
            var user = await _context.Users.IgnoreQueryFilters().SingleOrDefaultAsync(u => u.Email == request.Email && u.Status != "Deleted");
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials.");
            }

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    MessId = user.MessId
                }
            });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponseDto>> Refresh(TokenDto tokenDto)
        {
            var user = await _context.Users.IgnoreQueryFilters().SingleOrDefaultAsync(u => u.RefreshToken == tokenDto.RefreshToken);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var newAccessToken = _tokenService.GenerateAccessToken(user);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    MessId = user.MessId
                }
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                               ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            
            if (!int.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Unauthorized();
            }

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto request)
        {
            _logger.LogWarning("🔍 ForgotPassword called with email: '{Email}'", request.Email);

            var user = await _context.Users.IgnoreQueryFilters().SingleOrDefaultAsync(u => u.Email == request.Email && u.Status != "Deleted");
            if (user == null)
            {
                _logger.LogWarning("❌ No active user found for email: '{Email}' — skipping email send.", request.Email);
                // We return Ok even if user doesn't exist to prevent email enumeration
                return Ok(new { message = "If the email is registered, a password reset link has been sent." });
            }
            _logger.LogWarning("✅ User found: Id={Id}, Email='{Email}', Status='{Status}'", user.Id, user.Email, user.Status);

            var token = Guid.NewGuid().ToString(); // Or use a secure random token generator
            user.ResetPasswordToken = token;
            user.ResetPasswordTokenExpiryTime = DateTime.UtcNow.AddHours(1);

            await _context.SaveChangesAsync();

            // In production, build actual client URL from configuration
            // For now, assuming React default local port (http://localhost:5173/reset-password)
            var resetLink = $"http://localhost:5173/reset-password?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(token)}";

            try
            {
                await _emailService.SendPasswordResetEmailAsync(user.Email, resetLink);
                _logger.LogInformation("Password reset email sent successfully to {Email}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", user.Email);
                return StatusCode(500, new { message = "Failed to send reset email. Please check server email configuration.", error = ex.Message });
            }

            return Ok(new { message = "If the email is registered, a password reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto request)
        {
            var user = await _context.Users.IgnoreQueryFilters().SingleOrDefaultAsync(u => u.Email == request.Email && u.Status != "Deleted");
            if (user == null)
            {
                return BadRequest("Invalid request.");
            }

            if (user.ResetPasswordToken != request.Token || user.ResetPasswordTokenExpiryTime <= DateTime.UtcNow)
            {
                return BadRequest("Invalid or expired token.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpiryTime = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successfully." });
        }
    }
}
