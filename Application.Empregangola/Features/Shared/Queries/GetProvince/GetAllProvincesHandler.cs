using Domain.Empregangola.Interfaces;
using MediatR;

namespace Application.Empregangola.Features.Shared.Queries.GetProvince;

public class GetAllProvincesHandler : IRequestHandler<GetAllProvincesQuery, List<GetAllProvinceResponse>>
{
    private readonly IProvinceRepository _provinceRepository;

    public GetAllProvincesHandler(IProvinceRepository provinceRepository)
    {
        _provinceRepository = provinceRepository;
    }

    public async Task<List<GetAllProvinceResponse>> Handle(GetAllProvincesQuery request, CancellationToken cancellationToken)
    {
        var provinces = await _provinceRepository.GetAllAsync(cancellationToken);

        return provinces
            .Select(p => new GetAllProvinceResponse(p.ProvinceId, p.Name))
            .ToList();
    }
}
