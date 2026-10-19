using MediatR;

namespace Application.Empregangola.Features.Vacancy.Queries.GetPublicVacancies;

public record GetPublicVacanciesQuery(
        string? Search,
        int? CategoryId,
        int? ProvinceId,
        int? ContractType,
        int Page,
        int PageSize
    ) : IRequest<PagedResult<PublicVacancyListItemDto>>;
