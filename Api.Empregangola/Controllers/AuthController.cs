using Application.Empregangola.DTOs.Requests;
using Application.Empregangola.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Empregangola.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var response = await _authService.RegisterAsync(request);

            if (response == null)
                return BadRequest("User already exists or invalid data");

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var response = await _authService.LoginAsync(request.Email, request.Password);

            if (response == null)
                return Unauthorized("Credenciais inválidas");

            return Ok(response);
        }
    }
}
