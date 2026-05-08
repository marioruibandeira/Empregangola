
using Application.Empregangola.DTOs.Requests;
using Application.Empregangola.DTOs.Responses;
using Microsoft.AspNetCore.Identity;

namespace Application.Empregangola.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> LoginAsync(string email, string password);
        //Task RegisterAsync(RegisterRequest request);
    }
}
