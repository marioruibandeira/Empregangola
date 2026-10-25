using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using Infrastructure.Empregangola.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Empregangola.Repositories;

public class JobApplicationRepository : IJobApplicationRepository
{
    private readonly AppDbContext _context;

    public JobApplicationRepository(AppDbContext context) 
    {
        _context = context;
    }
    public async Task<bool> ExistsAsync(int vacancyId, CancellationToken cancellationToken)
    {
        return await _context.JobApplication.AnyAsync(c => c.VacancyId == vacancyId, cancellationToken);
    }

    public async Task<JobApplicationTable> CreateAsync(JobApplicationTable application, CancellationToken cancellationToken)
    {
        try
        {
            await _context.JobApplication.AddAsync(application, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return application;
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERRO EF: " + ex.Message);
            Console.WriteLine("INNER: " + ex.InnerException?.Message);
            throw;
        }
    }
}
