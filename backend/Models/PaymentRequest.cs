using System;

namespace Backend.Models
{
    public class PaymentRequest
    {
        public int Id { get; set; }
        public int MessId { get; set; }
        public string ManagerEmail { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string? Note { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Mess Mess { get; set; } = null!;
    }
}
