using Domain.Empregangola.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Empregangola.Persistence;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.Property(u => u.FullName)
                  .HasMaxLength(150)
                  .IsRequired(false);
        });

        modelBuilder.Entity<UserDetailsTable>()
            .HasIndex(u => u.AppUserId)
            .IsUnique();
    }

    public DbSet<UserDetailsTable> UserDetails { get; set; }
}