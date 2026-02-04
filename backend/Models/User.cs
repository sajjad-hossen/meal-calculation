using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Status { get; set; } = "Active"; // Active, Left
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
