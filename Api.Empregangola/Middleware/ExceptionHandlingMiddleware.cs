using FluentValidation;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;
using ValidationException = FluentValidation.ValidationException;

namespace Api.Empregangola.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex) 
        { 
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );

            var response = new
            {
                status = 400,
                message = "Validation failed.",
                errors
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch(InvalidOperationException ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Conflict;
            context.Response.ContentType = "application/json";

            var response = new
            {
                stustus = 409,
                message = ex.Message
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch(Exception ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new
            {
                status = 500,
                message = "An unexpected error occured."
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
