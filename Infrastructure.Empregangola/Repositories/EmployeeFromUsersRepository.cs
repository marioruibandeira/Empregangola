using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using Infrastructure.Empregangola.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Empregangola.Repositories;

public class EmployeeFromUsersRepository : IEmployeeFromUsersRepository
{
    private readonly AppDbContext _context;

    public EmployeeFromUsersRepository(AppDbContext context) 
    {  
        _context = context; 
    }

    public async Task<EmployeeTable> CreateAsync(EmployeeTable employee, CancellationToken cancellationToken)
    {
        try
        {
            await _context.Employee.AddAsync(employee, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return employee;
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERRO EF: " + ex.Message);
            Console.WriteLine("INNER: " + ex.InnerException?.Message);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(string appUserId, CancellationToken cancellationToken)
    {
        return await _context.Employee.AnyAsync(u => u.AppUserId == appUserId, cancellationToken);
    }
}
