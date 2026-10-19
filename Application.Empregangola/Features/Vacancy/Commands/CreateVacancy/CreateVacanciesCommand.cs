using Domain.Empregangola.Enums;
using MediatR;

namespace Application.Empregangola.Features.Vacancy.Commands.CreateVacancy;

public record CreateVacanciesCommand(
        int VacanciesId,

        Guid CompanyId,
        string? CompanyName,

        string Title,

        int? CategoryId,
        string? CategoryName,

        int NumberOfVacancies,
        EmploymentType? ContractType,
        WorkMode? WorkMode,

        int? ProvinceId,
        string? ProvinceName,
        string? Municipality,

        bool Diaspora,
        string? Description,
        EducationLevel EducationLevel,
        MinimumExperience ExperienceLevel,

        decimal? SalaryMin,
        decimal? SalaryMax,
        bool NegotiableSalary,

        DateTime? Deadline,

        ApplicationMethod ApplicationMethod,
        string? ApplicationTarget,

        VacancyStatus Status,

        DateTime CreatedAt,
        DateTime? UpdatedAt,

        // 
        List<string> Responsibilities,
        List<string> Requirements,
        List<string> Skills,
        List<string> Benefits,
        List<string> Languages,

        string? AppUserId = null,
        bool IsDraft = false
    ) : IRequest<CreateVacanciesResponse>;
