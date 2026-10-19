using MediatR;

namespace Application.Empregangola.Features.Vacancy.Queries.GetPublicVacancyById;

public record GetPublicVacancyByIdQuery(int VacanciesId) : IRequest<PublicVacancyDetailDto?>;

public record PublicVacancyDetailDto(
    int VacanciesId,
    string Title,
    string CompanyName,
    string CategoryName,
    string ProvinceName,
    string Municipality,
    int? ContractType,
    int? WorkMode,
    int NumberOfVacancies,
    bool Diaspora,
    string Description,
    int EducationLevel,
    int MinimumExperience,
    decimal? SalaryMin,
    decimal? SalaryMax,
    bool NegotiableSalary,
    DateTime? Deadline,
    bool IsExpired,
    DateTime PublishedAt,
    int ApplicationMethod,
    string ApplicationTarget,
    List<string> Responsibilities,
    List<string> Requirements,
    List<string> Skills,
    List<string> Benefits,
    List<string> Languages);
