using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using Infrastructure.Empregangola.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Empregangola.Repositories;

public class ProvinceRepository : IProvinceRepository
{
    private readonly AppDbContext _context;

    public ProvinceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProvinceTable>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Provinces .OrderBy(p => p.Name) .ToListAsync(cancellationToken);
    }
}
