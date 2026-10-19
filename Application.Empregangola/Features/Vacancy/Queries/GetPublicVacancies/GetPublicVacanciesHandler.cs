using Domain.Empregangola.Interfaces;
using MediatR;

namespace Application.Empregangola.Features.Vacancy.Queries.GetPublicVacancies;

public class GetPublicVacanciesHandler : IRequestHandler<GetPublicVacanciesQuery, PagedResult<PublicVacancyListItemDto>>
{
    private readonly IVacanciesRepository _repository;
    public GetPublicVacanciesHandler(IVacanciesRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<PublicVacancyListItemDto>> Handle(
        GetPublicVacanciesQuery request, CancellationToken cancellationToken)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 50);

        var (vagas, total) = await _repository.GetPublicAsync(
            request.Search, request.CategoryId, request.ProvinceId, request.ContractType,
            page, pageSize, cancellationToken);

        var itens = vagas.Select(v => new PublicVacancyListItemDto(
            v.VacanciesId,
            v.Title,
            v.Company?.CompanyName ?? string.Empty,
            v.Province?.Name ?? string.Empty,
            v.Municipality,
            (int?)v.ContractType,
            (int?)v.WorkMode,
            (int)v.MinimumExperience,
            Resumir(v.Description),
            v.PublishedAt ?? v.CreatedAt)).ToList();

        var totalPaginas = (int)Math.Ceiling(total / (double)pageSize);

        return new PagedResult<PublicVacancyListItemDto>(itens, total, page, pageSize, totalPaginas);
    }

    private static string Resumir(string texto, int max = 160)
    {
        var t = texto.Trim();
        return t.Length <= max ? t : t[..max].TrimEnd() + "…";
    }
}
