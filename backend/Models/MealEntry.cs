using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class MealEntry
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        public DateTime Date { get; set; }
        
        // Meal count can be fractional or integer, typically 0.5, 1, etc. but user asked for 0,1,2,3,4
        // Storing as double allows for half-meals if needed later, but int is fine based on request.
        // User said "0,1,2,3,4", so sticking to double to be safe for half meals or just double/decimal.
        // Let's use double to be safe.
        public double MealCount { get; set; } 
    }
}
