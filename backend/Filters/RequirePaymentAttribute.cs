using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Backend.Data;
using System;
using System.Threading.Tasks;

namespace Backend.Filters
{
    public class RequirePaymentAttribute : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var dbContext = context.HttpContext.RequestServices.GetRequiredService<MessContext>();
            var messId = dbContext.CurrentMessId;
            
            if (messId.HasValue)
            {
                var mess = await dbContext.Messes.FindAsync(messId.Value);
                if (mess != null)
                {
                    var currentMonth = DateTime.UtcNow.ToString("yyyy-MM");
                    if (mess.LastPaidMonth != currentMonth)
                    {
                        context.Result = new ObjectResult(new { message = "Payment required for the current month to perform operations." })
                        {
                            StatusCode = 402 // Payment Required
                        };
                        return;
                    }
                }
            }
            
            await next();
        }
    }
}
