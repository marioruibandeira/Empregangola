using Domain.Empregangola.Entities;

namespace Domain.Empregangola.Interfaces;

public interface IEmployeeFromUsersRepository
{
    Task<EmployeeTable> CreateAsync(EmployeeTable employee, CancellationToken cancellation);
    Task<bool> ExistsAsync(string appUserId, CancellationToken cancellationToken);
}
