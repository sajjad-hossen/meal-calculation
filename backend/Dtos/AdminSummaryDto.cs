using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class MessSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string UniqueCode { get; set; } = string.Empty;
        public string? ManagerEmail { get; set; }
        public DateTime CreatedAt { get; set; }
        public int MemberCount { get; set; }
        public string? LastPaidMonth { get; set; }
    }

    public class AdminSummaryDto
    {
        public int TotalMesses { get; set; }
        public int TotalMembers { get; set; }
        public List<MessSummaryDto> Messes { get; set; } = new List<MessSummaryDto>();
    }
}
