using Domain.Empregangola.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("Vacancies")]
public class VacanciesTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int VacanciesId { get; set; }

    [Required]
    public Guid CompanyId { get; set; }

    [ForeignKey(nameof(CompanyId))]
    public CompanyTable Company { get; set; } = null!;

    [Required]
    public int CategoryId { get; set; }

    [ForeignKey(nameof(CategoryId))]
    public CategoryTable Category { get; set; } = null!;

    [Required]
    [MaxLength(80)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public int NumberOfVacancies { get; set; }

    [Required]
    public EmploymentType ContractType { get; set; }

    [Required]
    public WorkMode WorkMode { get; set; }

    [Required]
    public int ProvinceId { get; set; }

    [ForeignKey(nameof(ProvinceId))]
    public ProvinceTable Province { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string Municipality { get; set; } = string.Empty;

    [Required]
    public bool Diaspora { get; set; }

    [Required]
    [MaxLength(5000)]
    public string Description { get; set; } = string.Empty;

    public EducationLevel EducationLevel { get; set; }

    public MinimumExperience MinimumExperience { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? SalaryMin { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? SalaryMax { get; set; }

    [Required]
    public bool NegotiableSalary { get; set; }

    [Required]
    public DateTime Deadline { get; set; }

    [Required]
    public ApplicationMethod ApplicationMethod { get; set; }

    [MaxLength(200)]
    public string? ApplicationTarget { get; set; }

    [Required]
    public VacancyStatus Status { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public ICollection<VacancyResponsibilitiesTable> Responsibilities { get; set; } = [];

    public ICollection<VacancyRequirementsTable> Requirements { get; set; } = [];

    public ICollection<LanguagesTable> Languages { get; set; } = [];

    public ICollection<VacancySkillsTable> Skills { get; set; } = [];

    public ICollection<VacancyBenefitsTable> Benefits { get; set; } = [];
}