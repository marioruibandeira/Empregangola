using Domain.Empregangola.Interfaces;
using MediatR;

namespace Application.Empregangola.Features.Vacancy.Queries.GetMyVacancies;

public class GetMyVacanciesHandler : IRequestHandler<GetMyVacanciesQuery, List<VacancyListItemDto>>
{
    private readonly IVacanciesRepository _repository;

    public GetMyVacanciesHandler(IVacanciesRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<VacancyListItemDto>> Handle(GetMyVacanciesQuery request, CancellationToken cancellationToken)
    {
        var companyId = await _repository.GetCompanyIdByUserAsync(request.AppUserId, cancellationToken);

        if (companyId is null)
            return new List<VacancyListItemDto>();

        var vagas = await _repository.GetByCompanyAsync(companyId.Value, cancellationToken);

        return vagas
            .Select(v => new VacancyListItemDto(
                v.VacanciesId,
                v.Title,
                v.Category?.Name ?? string.Empty,
                v.Status,
                v.CreatedAt,
                v.CategoryId,
                (int?)v.ContractType,
                (int?)v.WorkMode,
                v.ProvinceId,
                v.Deadline))
            .ToList();
    }
}
