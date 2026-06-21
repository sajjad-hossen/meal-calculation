using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            string message = "An unexpected error occurred. Please try again later.";
            int statusCode = (int)HttpStatusCode.InternalServerError;

            if (exception is DbUpdateException)
            {
                message = "A database error occurred. This might be due to a duplicate entry or invalid data.";
                statusCode = (int)HttpStatusCode.BadRequest;
            }
            else if (exception is UnauthorizedAccessException)
            {
                message = "You are not authorized to perform this action.";
                statusCode = (int)HttpStatusCode.Unauthorized;
            }

            var result = JsonSerializer.Serialize(new
            {
                message = message,
                details = exception.Message // Included for developer visibility, but the frontend will show `message`
            });

            context.Response.StatusCode = statusCode;
            return context.Response.WriteAsync(result);
        }
    }
}
