using System.Collections.Generic;

namespace Backend.Dtos
{
    public class SummaryDto
    {
        public int TotalMembers { get; set; }
        public decimal TotalDeposit { get; set; }
        public double TotalMeal { get; set; }
        public decimal TotalCost { get; set; }
        public decimal MealRate { get; set; }
        public List<UserSummaryDto> UserSummaries { get; set; } = new List<UserSummaryDto>();
    }

    public class UserSummaryDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public decimal TotalDeposit { get; set; }
        public double TotalMeal { get; set; }
        public decimal MealCost { get; set; }
        public decimal Balance { get; set; }
    }
}
