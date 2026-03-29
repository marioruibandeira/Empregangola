using Domain.Empregangola.Entities;

namespace Infrastructure.Empregangola.Identity
{
    public interface ITokenService
    {
        string GenerateToken(AppUser user);
    }
}
