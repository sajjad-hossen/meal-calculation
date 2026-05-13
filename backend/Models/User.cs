using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        
        public string? Email { get; set; }
        
        public string? PasswordHash { get; set; }

        public string Role { get; set; } = "Member"; // Manager, Member

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public string Status { get; set; } = "Active"; // Active, Left
        public bool IsCalculationMember { get; set; } = false;
        public int MessId { get; set; }
        public Mess? Mess { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
