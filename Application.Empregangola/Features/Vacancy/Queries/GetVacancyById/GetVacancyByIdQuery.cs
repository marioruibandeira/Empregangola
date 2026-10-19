using MediatR;

namespace Application.Empregangola.Features.Vacancy.Queries.GetVacancyById;

public record GetVacancyByIdQuery(int VacanciesId, string AppUserId) : IRequest<VacancyDetailDto?>;

public record VacancyDetailDto(
    int VacanciesId,
    string Title,
    string CategoryName,
    int? CategoryId,          // era int
    int NumberOfVacancies,
    int? ContractType,        // era int  (este é o argumento 6)
    int? WorkMode,            // era int
    string ProvinceName,
    int? ProvinceId,          // era int
    string Municipality,
    bool Diaspora,
    string Description,
    int EducationLevel,
    int ExperienceLevel,
    decimal? SalaryMin,
    decimal? SalaryMax,
    bool NegotiableSalary,
    DateTime? Deadline,       // era DateTime
    int ApplicationMethod,
    string ApplicationTarget,
    int Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<string> Responsibilities,
    List<string> Requirements,
    List<string> Skills,
    List<string> Benefits,
    List<string> Languages
);
