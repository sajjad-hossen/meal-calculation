using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class BazarCost
    {
        public int Id { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        
        public int BuyerUserId { get; set; }
        [ForeignKey("BuyerUserId")]
        public User? Buyer { get; set; }
    }
}
