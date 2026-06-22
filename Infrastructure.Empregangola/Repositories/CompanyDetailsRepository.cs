using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using Infrastructure.Empregangola.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Empregangola.Repositories;

public class CompanyDetailsRepository : ICompanyDetailsRepository
{
    private readonly AppDbContext _context;

    public CompanyDetailsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(string appUserId, CancellationToken cancellationToken)
    {
        return await _context.Company.AnyAsync(c => c.AppUserId == appUserId, cancellationToken);
    }

    public async Task<CompanyTable> CreateAsync(CompanyTable company, CancellationToken cancellationToken)
    {
        try 
        {
            await _context.Company.AddAsync(company, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return company;
        }
        catch(Exception ex)
        {
            Console.WriteLine("ERRO EF: " + ex.Message);
            Console.WriteLine("INNER: " + ex.InnerException?.Message);
            throw;
        }
    }

    public async Task<CompanyTable> GetCompanyDetailsById(string appUserId, CancellationToken cancellationToken)
    {
        return await _context.Company.FirstOrDefaultAsync(c => c.AppUserId == appUserId, cancellationToken);
    }

    public async Task<CompanyTable> UpdateCompanyDetails(CompanyTable company, CancellationToken cancellationToken)
    {
        _context.Company.Update(company);
        await _context.SaveChangesAsync(cancellationToken);
        return company;
    }

    public async Task CompanyInterestsAsync(Guid companyId, string appUserId, List<int> interestIds, CancellationToken cancellationToken)
    {
        var existing = _context.CompanyInterest.Where(ci => ci.CompanyId == companyId);
        _context.CompanyInterest.RemoveRange(existing);

        var newInterests = interestIds.Select(interestId => new CompanyInterestTable
        {
            CompanyId = companyId,
            AppUserId = appUserId,
            InterestId = interestId
        });

        await _context.CompanyInterest.AddRangeAsync(newInterests, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<int>> GetInterestIdsByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken)
    {
        return await _context.CompanyInterest
            .Where(ci => ci.CompanyId == companyId)
            .Select(ci => ci.InterestId)
            .ToListAsync(cancellationToken);
    }
}
