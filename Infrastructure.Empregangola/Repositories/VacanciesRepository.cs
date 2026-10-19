using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;
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

    public async Task<Guid?> GetCompanyIdByUserAsync(string appUserId, CancellationToken cancellationToken)
    {
        return await _context.Company
            .Where(c => c.AppUserId == appUserId)
            .Select(c => (Guid?)c.CompanyId)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<LanguagesTable>> GetLanguagesByNamesAsync(IEnumerable<string> names, CancellationToken cancellationToken)
    {
        var lista = names.ToList();

        return await _context.Languages
            .Where(l => lista.Contains(l.Name))
            .ToListAsync(cancellationToken);
    }

    public async Task<List<VacanciesTable>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken)
    {
        return await _context.Vacancies
            .AsNoTracking()
            .Include(v => v.Category)
            .Where(v => v.CompanyId == companyId)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<VacanciesTable?> GetByIdAsync(int vacanciesId, Guid companyId, CancellationToken cancellationToken)
    {
        return await _context.Vacancies
            .AsNoTracking()
            .AsSplitQuery()
            .Include(v => v.Category)
            .Include(v => v.Province)
            .Include(v => v.Responsibilities)
            .Include(v => v.Requirements)
            .Include(v => v.Skills)
            .Include(v => v.Benefits)
            .Include(v => v.Languages)
            .FirstOrDefaultAsync(v => v.VacanciesId == vacanciesId && v.CompanyId == companyId, cancellationToken);
    }

    public async Task<VacancyStatus?> GetStatusAsync(int vacanciesId, Guid companyId, CancellationToken cancellationToken)
    {
        return await _context.Vacancies
            .AsNoTracking()
            .Where(v => v.VacanciesId == vacanciesId && v.CompanyId == companyId)
            .Select(v => (VacancyStatus?)v.Status)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> PublishAsync(int vacanciesId, Guid companyId, CancellationToken cancellationToken)
    {
        var linhas = await _context.Vacancies
        .Where(v => v.VacanciesId == vacanciesId
                 && v.CompanyId == companyId
                 && v.Status == VacancyStatus.Open)
        .ExecuteUpdateAsync(s => s
            .SetProperty(v => v.Status, VacancyStatus.Published)
            .SetProperty(v => v.PublishedAt, DateTime.UtcNow)
            .SetProperty(v => v.UpdatedAt, DateTime.UtcNow),
            cancellationToken);

        return linhas > 0;
    }

    public async Task<string?> GetCompanyNameByUserAsync(string appUserId, CancellationToken cancellationToken)
    {
        return await _context.Company
            .AsNoTracking()
            .Where(c => c.AppUserId == appUserId)
            .Select(c => c.CompanyName)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<VacanciesTable?> GetForUpdateAsync(int vacanciesId, Guid companyId, CancellationToken cancellationToken)
    {
        return await _context.Vacancies
            .AsSplitQuery()
            .Include(v => v.Responsibilities)
            .Include(v => v.Requirements)
            .Include(v => v.Skills)
            .Include(v => v.Benefits)
            .Include(v => v.Languages)
            .FirstOrDefaultAsync(v => v.VacanciesId == vacanciesId && v.CompanyId == companyId, cancellationToken);
    }

    public async Task UpdateAsync(VacanciesTable vacancy, CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<(List<VacanciesTable> Items, int Total)> GetPublicAsync(
    string? search, int? categoryId, int? provinceId, int? contractType,
    int page, int pageSize, CancellationToken cancellationToken)
    {
        var hoje = DateTime.UtcNow.Date;

        var consulta = _context.Vacancies
            .AsNoTracking()
            .Where(v => v.Status == VacancyStatus.Published && v.Deadline >= hoje);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var termo = search.Trim();
            consulta = consulta.Where(v =>
                v.Title.Contains(termo) ||
                v.Description.Contains(termo) ||
                v.Company.CompanyName.Contains(termo));
        }

        if (categoryId.HasValue)
            consulta = consulta.Where(v => v.CategoryId == categoryId);

        if (provinceId.HasValue)
            consulta = consulta.Where(v => v.ProvinceId == provinceId);

        if (contractType.HasValue)
        {
            var tipo = (EmploymentType)contractType.Value;
            consulta = consulta.Where(v => v.ContractType == tipo);
        }

        var total = await consulta.CountAsync(cancellationToken);

        var itens = await consulta
            .Include(v => v.Company)
            .Include(v => v.Province)
            .OrderByDescending(v => v.PublishedAt ?? v.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (itens, total);
    }

    public async Task<VacanciesTable?> GetPublicByIdAsync(int vacanciesId, CancellationToken cancellationToken)
    {
        return await _context.Vacancies
            .AsNoTracking()
            .AsSplitQuery()
            .Include(v => v.Company)
            .Include(v => v.Category)
            .Include(v => v.Province)
            .Include(v => v.Responsibilities)
            .Include(v => v.Requirements)
            .Include(v => v.Skills)
            .Include(v => v.Benefits)
            .Include(v => v.Languages)
            .FirstOrDefaultAsync(
                v => v.VacanciesId == vacanciesId && v.Status == VacancyStatus.Published,
                cancellationToken);
    }
}
