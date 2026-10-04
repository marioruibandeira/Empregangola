using Domain.Empregangola.Enums;
using MediatR;

namespace Application.Empregangola.Features.Vacancy.Commands.CreateVacancy;

public record CreateVacanciesCommand(
        int VacanciesId,

        // Empresa (dados já resolvidos, não o Id cru)
        Guid CompanyId,
        string CompanyName,

        string Title,

        // Categoria (nome, não o Id)
        int CategoryId,
        string CategoryName,

        int NumberOfVacancies,
        EmploymentType ContractType,
        WorkMode WorkMode,

        // Localização (nome, não o Id)
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
    ) : IRequest<CreateVacanciesResponse>;
