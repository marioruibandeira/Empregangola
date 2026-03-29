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

    // Mantém o DbSet se quiseres acesso direto (opcional, pois Identity já tem)
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações adicionais do Identity (opcional, mas recomendado)
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.Property(u => u.FullName)
                  .HasMaxLength(150)
                  .IsRequired(false);
        });

        // Se quiseres renomear tabelas do Identity (exemplo)
        // modelBuilder.Entity<IdentityUser>().ToTable("Users");
        // modelBuilder.Entity<IdentityRole>().ToTable("Roles");

        // Aqui podes adicionar configurações de outras entidades no futuro
    }
}
