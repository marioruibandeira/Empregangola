using MediatR;

namespace Application.Empregangola.Features.CompanyDetails.Queries.GetCompanyDetails;

public record GetCompanyProfileQuery(string UserId) : IRequest<CompanyDetailsDto>;
