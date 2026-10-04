using Domain.Empregangola.Enums;

namespace Application.Empregangola.Features.Vacancy.Commands.CreateVacancy;

public record CreateVacanciesResponse(
    int VacanciesId,

    Guid CompanyId,
    string CompanyName,

    string Title,

    int CategoryId,
    string CategoryName,

    int NumberOfVacancies,
    EmploymentType ContractType,
    WorkMode WorkMode,

    int ProvinceId,
    string ProvinceName,

    bool Diaspora,
    string Description,
    EducationLevel EducationLevel,
    MinimumExperience ExperienceLevel,

    decimal? SalaryMin,
    decimal? SalaryMax,
    bool NegotiableSalary,

    DateTime Deadline,

    ApplicationMethod ApplicationMethod,
    string ApplicationTarget,

    VacancyStatus Status,

    DateTime CreatedAt,
    DateTime? UpdatedAt,

    // Listas (já achatadas para strings/simples, sem expor as tabelas filhas cruas)
    List<string> Responsibilities,
    List<string> Requirements,
    List<string> Skills,
    List<string> Benefits,
    List<string> Languages
);