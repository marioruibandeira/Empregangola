using MediatR;

namespace Application.Empregangola.Features.Shared.Queries.GetCategory;

public record GetAllCategoriesQuery() : IRequest<List<GetAllCategoriesResponse>>;
