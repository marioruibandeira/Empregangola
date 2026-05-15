using Domain.Empregangola.Entities;

namespace Domain.Empregangola.Interfaces;

public interface IUserDetailsRepository
{
    Task<UserDetailsTable> CreateAsync(UserDetailsTable userDetails, CancellationToken cancellation);
    Task<bool> ExistsAsync(string appUserId, CancellationToken cancellationToken);
    Task<UserDetailsTable> GetByAppUserIdAsync(string appUserId, CancellationToken cancellationToken);
    Task<UserDetailsTable> UpdateAsync(UserDetailsTable userDetails, CancellationToken cancellationToken);
}
