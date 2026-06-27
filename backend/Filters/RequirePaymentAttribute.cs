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
                    var now = DateTime.UtcNow;
                    var currentMonth = now.ToString("yyyy-MM");
                    var previousMonth = now.AddMonths(-1).ToString("yyyy-MM");

                    bool hasAccess = mess.LastPaidMonth == currentMonth || 
                                     (now.Day <= 5 && mess.LastPaidMonth == previousMonth);

                    if (!hasAccess)
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
