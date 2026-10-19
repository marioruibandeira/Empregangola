namespace Application.Empregangola.Features.Vacancy.Queries.GetPublicVacancies;

public record PublicVacancyListItemDto(
        int VacanciesId,
        string Title,
        string CompanyName,
        string ProvinceName,
        string Municipality,
        int? ContractType,
        int? WorkMode,
        int MinimumExperience,
        string Summary,
        DateTime PublishedAt
    );

public record PagedResult<T>(
    List<T> Items,
    int Total,
    int Page,
    int PageSize,
    int TotalPages);