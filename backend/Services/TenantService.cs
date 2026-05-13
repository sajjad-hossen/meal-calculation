using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Backend.Services
{
    public interface ITenantService
    {
        int? GetMessId();
    }

    public class TenantService : ITenantService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TenantService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int? GetMessId()
        {
            var claim = _httpContextAccessor.HttpContext?.User?.FindFirst("MessId")?.Value;
            if (int.TryParse(claim, out var messId))
            {
                return messId;
            }
            return null;
        }
    }
}
