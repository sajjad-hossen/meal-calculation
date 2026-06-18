using System;

namespace Backend.Dtos
{
    public class SubmitPaymentRequestDto
    {
        public string ManagerEmail { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string? Note { get; set; }
    }

    public class PaymentRequestDto
    {
        public int Id { get; set; }
        public int MessId { get; set; }
        public string MessName { get; set; } = string.Empty;
        public string ManagerEmail { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string? Note { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
