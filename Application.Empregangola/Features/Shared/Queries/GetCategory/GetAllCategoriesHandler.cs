using Domain.Empregangola.Interfaces;
using MediatR;

namespace Application.Empregangola.Features.Shared.Queries.GetCategory;

public class GetAllCategoriesHandler : IRequestHandler<GetAllCategoriesQuery, List<GetAllCategoriesResponse>>
{
    private readonly ICategoryRepository _repository;

    public GetAllCategoriesHandler(ICategoryRepository repository) 
    {
        _repository = repository;
    }

    public async Task<List<GetAllCategoriesResponse>> Handle(GetAllCategoriesQuery getAllCategoriesQuery, CancellationToken cancellationToken)
    {
        var category = await _repository.GetAllAsync(cancellationToken);

        return category.Select(p => new GetAllCategoriesResponse(p.CategoryId, p.Name)).ToList();
    }

}
