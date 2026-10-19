using MediatR;

namespace Application.Empregangola.Features.Shared.Queries.GetProvince;

public record GetAllProvincesQuery() : IRequest<List<GetAllProvinceResponse>>;
