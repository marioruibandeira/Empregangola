using Application.Empregangola.DTOs.Requests;
using Application.Empregangola.DTOs.Responses;
using Application.Empregangola.Interfaces;
using Domain.Empregangola.Entities;
using Infrastructure.Empregangola.Identity;
using Microsoft.AspNetCore.Identity;

namespace Application.Empregangola.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;

        public AuthService(UserManager<AppUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
        {
            var user = AppUser.Create(request.FullName, request.Email);

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded) return null;

            var token = _tokenService.GenerateToken(user);
            return new AuthResponse(token, user.Email, user.FullName);
        }

        public async  Task<AuthResponse?> LoginAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return null;

            var isValid = await _userManager.CheckPasswordAsync(user, password);
            if (!isValid)
                return null;

            var token = _tokenService.GenerateToken(user);
            return new AuthResponse(token, user.Email, user.FullName);
        }

    }
}
