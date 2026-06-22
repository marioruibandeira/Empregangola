using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Empregangola.Features.CompanyDetails.Queries.GetCompanyDetails;

public class GetCompanyDetailsHandler : IRequestHandler<GetCompanyProfileQuery, CompanyDetailsDto>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ICompanyDetailsRepository _repository;

    public GetCompanyDetailsHandler(UserManager<AppUser> userManager, ICompanyDetailsRepository repository)
    {
        _userManager = userManager;
        _repository = repository;
    }

    public async Task<CompanyDetailsDto> Handle(GetCompanyProfileQuery request, CancellationToken cancellationToken)
    {
        var userId = await _userManager.FindByIdAsync(request.UserId);
        var compDetails = await _repository.GetCompanyDetailsById(request.UserId, cancellationToken);

        if (userId == null)
            return null;

        var interestIds = await _repository.GetInterestIdsByCompanyIdAsync(compDetails.CompanyId, cancellationToken);

        if (compDetails != null)
        {
            return new CompanyDetailsDto
            {
                AppUserId = userId.Id,
                CompanyId = compDetails.CompanyId,
                CompanyName = compDetails.CompanyName,
                TaxNumber = compDetails.TaxNumber,
                ActivitySectorId = compDetails.ActivitySectorId,
                EmployeeCountId = compDetails.EmployeeCountId,
                CountryId = compDetails.CountryId,
                Provincy = compDetails.Provincy,
                Municipality = compDetails.Municipality,
                PersonResponsible = compDetails.PersonResponsible,
                Position = compDetails.Position,
                CorporateEmail = compDetails.CorporateEmail,
                Phone = compDetails.Phone,
                AboutCompany = compDetails.AboutCompany,
                InterestIds = interestIds
            };
        }

        return null;
    }
}
