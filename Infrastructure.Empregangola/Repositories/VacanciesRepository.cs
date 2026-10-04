using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using Infrastructure.Empregangola.Persistence;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Infrastructure.Empregangola.Repositories;

public class VacanciesRepository : IVacanciesRepository
{
    private readonly AppDbContext _context;

    public VacanciesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<VacanciesTable> CreateAsync(VacanciesTable vacancies, CancellationToken cancellationToken)
    {
        try
        {
            await _context.Vacancies.AddAsync(vacancies, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return vacancies;
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERRO EF: " + ex.Message);
            Console.WriteLine("INNER: " + ex.InnerException?.Message);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(string titulo, CancellationToken cancellationToken)
    {
        return await _context.Vacancies.AnyAsync(c => c.Title == titulo, cancellationToken);
    }
}
