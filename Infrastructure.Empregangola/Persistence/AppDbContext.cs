using Domain.Empregangola.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

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

        modelBuilder.Entity<CountryTable>(entity =>
        {
            entity.Property(u => u.Country)
                .HasMaxLength(50)
                .IsRequired(true);
        });

        modelBuilder.Entity<CompanyTable>()
            .HasIndex(cn => cn.CompanyId)
            .IsUnique();

        modelBuilder.Entity<CompanyTable>(entity => {
            entity.Property(u => u.CompanyName)
            .HasMaxLength(50)
            .IsRequired(true);

            entity.Property(cn => cn.TaxNumber)
            .HasMaxLength(50)
            .IsRequired(true);

            entity.Property(cn => cn.Provincy)
            .HasMaxLength(50)
            .IsRequired(true);

            entity.Property(cn => cn.Municipality)
            .HasMaxLength(50)
            .IsRequired(true);

            entity.Property(cn => cn.PersonResponsible)
            .HasMaxLength(50)
            .IsRequired(true);
        });

        modelBuilder.Entity<CompanyInterestTable>(entity =>
        {
            entity.Property(ci => ci.InterestId)
            .IsRequired(true);

            entity.Property(ci => ci.CompanyId)
            .IsRequired(true);

            entity.Property(ci => ci.AppUserId)
            .IsRequired(true);
        });

        modelBuilder.Entity<CompanyInterestTable>()
            .HasOne(ci => ci.AppUser)
            .WithMany()
            .HasForeignKey(ci => ci.AppUserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<CompanyInterestTable>()
            .HasOne(ci => ci.Company)
            .WithMany()
            .HasForeignKey(ci => ci.CompanyId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<CompanyInterestTable>()
            .HasOne(ci => ci.Interest)
            .WithMany()
            .HasForeignKey(ci => ci.InterestId)
            .OnDelete(DeleteBehavior.NoAction);
    }

    public DbSet<UserDetailsTable> UserDetails { get; set; }
    public DbSet<CountryTable> Country { get; set; }
    public DbSet<CompanyTable> Company { get; set; }
    public DbSet<ActivitySectorTable> ActivitySector { get; set; }
    public DbSet<EmployeeCountTable> EmployeeCount { get; set; }
    public DbSet<InterestTable> Interest { get; set; }
    public DbSet<PositionTable> Position { get; set; }
    public DbSet<CompanyInterestTable> CompanyInterest { get; set; }
}