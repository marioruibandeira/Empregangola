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

        modelBuilder.Entity<CountryTable>(entity =>
        {
            entity.Property(c => c.Country)
                .HasMaxLength(50)
                .IsRequired();
        });

        modelBuilder.Entity<CompanyTable>()
            .HasIndex(c => c.CompanyId)
            .IsUnique();

        modelBuilder.Entity<CompanyTable>(entity =>
        {
            entity.Property(c => c.CompanyName)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(c => c.TaxNumber)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(c => c.Provincy)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(c => c.Municipality)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(c => c.PersonResponsible)
                .HasMaxLength(50)
                .IsRequired();
        });

        modelBuilder.Entity<CompanyInterestTable>(entity =>
        {
            entity.Property(ci => ci.InterestId)
                .IsRequired();

            entity.Property(ci => ci.CompanyId)
                .IsRequired();

            entity.Property(ci => ci.AppUserId)
                .IsRequired();
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

        // =====================================================
        // VACANCIES
        // =====================================================

        modelBuilder.Entity<VacanciesTable>(entity =>
        {
            entity.Property(v => v.Title)
                .HasMaxLength(80)
                .IsRequired();

            entity.Property(v => v.Municipality)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(v => v.Description)
                .HasMaxLength(5000)
                .IsRequired();

            entity.Property(v => v.ApplicationTarget)
                .HasMaxLength(200);

            entity.Property(v => v.SalaryMin)
                .HasColumnType("decimal(18,2)");

            entity.Property(v => v.SalaryMax)
                .HasColumnType("decimal(18,2)");

            // Enums

            entity.Property(v => v.ContractType)
                .HasConversion<int>();

            entity.Property(v => v.WorkMode)
                .HasConversion<int>();

            entity.Property(v => v.EducationLevel)
                .HasConversion<int>();

            entity.Property(v => v.MinimumExperience)
                .HasConversion<int>();

            entity.Property(v => v.ApplicationMethod)
                .HasConversion<int>();

            entity.Property(v => v.Status)
                .HasConversion<int>();

            // Relacionamentos

            entity.HasOne(v => v.Company)
                .WithMany()
                .HasForeignKey(v => v.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(v => v.Category)
                .WithMany()
                .HasForeignKey(v => v.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(v => v.Province)
                .WithMany()
                .HasForeignKey(v => v.ProvinceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<VacancyResponsibilitiesTable>()
            .HasOne(r => r.Vacancy)
            .WithMany(v => v.Responsibilities)
            .HasForeignKey(r => r.VacanciesId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<VacancyRequirementsTable>()
            .HasOne(r => r.Vacancy)
            .WithMany(v => v.Requirements)
            .HasForeignKey(r => r.VacancyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<VacancySkillsTable>()
            .HasOne(s => s.Vacancy)
            .WithMany(v => v.Skills)
            .HasForeignKey(s => s.VacancyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<VacancyBenefitsTable>()
            .HasOne(b => b.Vacancy)
            .WithMany(v => v.Benefits)
            .HasForeignKey(b => b.VacancyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<VacanciesTable>()
            .HasMany(v => v.Languages)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "VacancyLanguages",
                right => right
                    .HasOne<LanguagesTable>()
                    .WithMany()
                    .HasForeignKey("LanguageId")
                    .OnDelete(DeleteBehavior.Cascade),
                left => left
                    .HasOne<VacanciesTable>()
                    .WithMany()
                    .HasForeignKey("VacancyId")
                    .OnDelete(DeleteBehavior.Cascade),
                join =>
                {
                    join.ToTable("VacancyLanguages");
                    join.HasKey("VacancyId", "LanguageId");
                });

        modelBuilder.Entity<PremiumServicesTable>(entity =>
        {
            entity.Property(x => x.ServiceName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.Description)
                .HasMaxLength(500);

            entity.Property(x => x.Price)
                .HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<PremiumSubscriptionTable>()
            .HasOne(x => x.PremiumService)
            .WithMany()
            .HasForeignKey(x => x.PremiumServiceId);

        modelBuilder.Entity<PremiumVacanciesTable>()
            .HasOne(x => x.PremiumSubscription)
            .WithMany()
            .HasForeignKey(x => x.PremiumSubscriptionId);

        modelBuilder.Entity<PremiumVacanciesTable>()
            .HasOne(x => x.Vacancy)
            .WithMany()
            .HasForeignKey(x => x.VacancyId);

        modelBuilder.Entity<EmployeeTable>()
            .Property(x => x.Gender)
            .HasConversion<int>();

        modelBuilder.Entity<EmployeeTable>()
            .Property(x => x.MaritalStatus)
            .HasConversion<int>();

        modelBuilder.Entity<EmployeeTable>(entity =>
        {
            entity.Property(x => x.FullName)
                .HasMaxLength (150);
        });
    }

    public DbSet<UserDetailsTable> UserDetails { get; set; }

    public DbSet<CountryTable> Country { get; set; }

    public DbSet<CompanyTable> Company { get; set; }

    public DbSet<ActivitySectorTable> ActivitySector { get; set; }

    public DbSet<EmployeeCountTable> EmployeeCount { get; set; }

    public DbSet<InterestTable> Interest { get; set; }

    public DbSet<PositionTable> Position { get; set; }

    public DbSet<CompanyInterestTable> CompanyInterest { get; set; }

    // Vacancies

    public DbSet<VacanciesTable> Vacancies { get; set; }

    public DbSet<VacancyResponsibilitiesTable> VacancyResponsibilities { get; set; }

    public DbSet<VacancyRequirementsTable> VacancyRequirements { get; set; }

    public DbSet<VacancySkillsTable> VacancySkills { get; set; }

    public DbSet<VacancyBenefitsTable> VacancyBenefits { get; set; }

    public DbSet<LanguagesTable> Languages { get; set; }

    public DbSet<CategoryTable> Categories { get; set; }

    public DbSet<ProvinceTable> Provinces { get; set; }

    //Planos
    public DbSet<PremiumServicesTable> PremiumServices { get; set; }

    public DbSet<PremiumSubscriptionTable> PremiumSubscriptions { get; set; }

    public DbSet<PremiumVacanciesTable> PremiumVacancies { get; set; }

    //Employee
    public DbSet<EmployeeTable> Employee { get; set; }
}