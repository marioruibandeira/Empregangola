using Domain.Empregangola.Entities;

namespace Domain.Empregangola.Interfaces;

public interface ICategoryRepository
{
    Task<List<CategoryTable>> GetAllAsync(CancellationToken cancellationToken);
}
