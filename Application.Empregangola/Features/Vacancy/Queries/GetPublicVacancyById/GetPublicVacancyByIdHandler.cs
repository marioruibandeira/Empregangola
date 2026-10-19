using Application.Empregangola.Features.Vacancy.Queries.GetPublicVacancyById;
using Domain.Empregangola.Interfaces;
using MediatR;

public class GetPublicVacancyByIdHandler : IRequestHandler<GetPublicVacancyByIdQuery, PublicVacancyDetailDto?>
{
    private readonly IVacanciesRepository _repository;

    public GetPublicVacancyByIdHandler(IVacanciesRepository repository)
    {
        _repository = repository;
    }

    public async Task<PublicVacancyDetailDto?> Handle(
        GetPublicVacancyByIdQuery request, CancellationToken cancellationToken)
    {
        // O repositório só devolve vagas publicadas
        var v = await _repository.GetPublicByIdAsync(request.VacanciesId, cancellationToken);
        if (v is null)
            return null;

        var expirada = v.Deadline.HasValue && v.Deadline.Value.Date < DateTime.UtcNow.Date;

        // O destino só é público quando a candidatura é por email (2) ou link (3)
        var metodo = (int)v.ApplicationMethod;
        var destino = metodo == 2 || metodo == 3 ? (v.ApplicationTarget ?? string.Empty) : string.Empty;

        return new PublicVacancyDetailDto(
            v.VacanciesId,
            v.Title,
            v.Company?.CompanyName ?? string.Empty,
            v.Category?.Name ?? string.Empty,
            v.Province?.Name ?? string.Empty,
            v.Municipality,
            (int?)v.ContractType,
            (int?)v.WorkMode,
            v.NumberOfVacancies,
            v.Diaspora,
            v.Description,
            (int)v.EducationLevel,
            (int)v.MinimumExperience,
            v.NegotiableSalary ? null : v.SalaryMin,
            v.NegotiableSalary ? null : v.SalaryMax,
            v.NegotiableSalary,
            v.Deadline,
            expirada,
            v.PublishedAt ?? v.CreatedAt,
            metodo,
            destino,
            v.Responsibilities.OrderBy(r => r.Order).Select(r => r.Description).ToList(),
            v.Requirements.OrderBy(r => r.Order).Select(r => r.Description).ToList(),
            v.Skills.Select(s => s.Skill).ToList(),
            v.Benefits.Select(b => b.Benefit).ToList(),
            v.Languages.Select(l => l.Name).ToList());
    }
}
