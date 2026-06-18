using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class Mess
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UniqueCode { get; set; } = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? LastPaidMonth { get; set; }

        // Navigation properties
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
