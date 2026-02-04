using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class ExtraCost
    {
        public int Id { get; set; }
        public string Title { get; set; } // Rent, Wifi, Gas
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        // Storing month as a date (1st of the month) or string? 
        // User said "Month". DateTime is safer for sorting.
        public DateTime Month { get; set; } 
    }
}
