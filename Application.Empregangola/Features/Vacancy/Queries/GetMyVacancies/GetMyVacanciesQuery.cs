using Domain.Empregangola.Enums;
using MediatR;

namespace Application.Empregangola.Features.Vacancy.Queries.GetMyVacancies;

public record GetMyVacanciesQuery(string AppUserId) : IRequest<List<VacancyListItemDto>>;
public record VacancyListItemDto(
    int VacanciesId,
    string Title,
    string CategoryName,
    VacancyStatus Status,
    DateTime CreatedAt,
    int? CategoryId,
    int? ContractType,
    int? WorkMode,
    int? ProvinceId,
    DateTime? Deadline
);
