using Domain.Empregangola.Entities;

namespace Domain.Empregangola.Interfaces;

public interface IProvinceRepository
{
    Task<List<ProvinceTable>> GetAllAsync(CancellationToken cancellationToken);
}
