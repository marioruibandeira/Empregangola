using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using Infrastructure.Empregangola.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Empregangola.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryTable>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Categories
            .OrderBy(p => p.Name)
            .ToListAsync(cancellationToken);
    }
}
