using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using Infrastructure.Empregangola.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Empregangola.Repositories
{
    public class UserDetailsRepository : IUserDetailsRepository
    {
        private readonly AppDbContext _context;

        public UserDetailsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserDetailsTable> CreateAsync(UserDetailsTable userDetails, CancellationToken cancellationToken)
        {
            try
            {
                await _context.UserDetails.AddAsync(userDetails, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                return userDetails;
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
            return await _context.UserDetails.AnyAsync(u => u.AppUserId == appUserId, cancellationToken);
        }

        public async Task<UserDetailsTable> GetByAppUserIdAsync(string appUserId, CancellationToken cancellationToken) 
        {
            return await _context.UserDetails.FirstOrDefaultAsync(u => u.AppUserId == appUserId, cancellationToken);
        }

        public async Task<UserDetailsTable> GetByUserIdAsync(string appUserId, CancellationToken cancellationToken)
        {
            return await _context.UserDetails.FirstOrDefaultAsync(u => u.AppUserId == appUserId, cancellationToken);
        }

        public async Task<UserDetailsTable> UpdateAsync(UserDetailsTable userDetails, CancellationToken cancellationToken) 
        {
            _context.UserDetails.Update(userDetails);
            await _context.SaveChangesAsync(cancellationToken);
            return userDetails;
        }
    }
}
