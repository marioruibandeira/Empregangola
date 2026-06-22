using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Empregangola.Features.CompanyDetails.Commands.CreateCompany;

public class CreateCompanyDetailsCommandHandler : IRequestHandler<CreateCompanyCommand, CreateCompanyDetailsResponse>
{
    private readonly ICompanyDetailsRepository _repository;
    private readonly UserManager<AppUser> _userManager;

    public CreateCompanyDetailsCommandHandler(ICompanyDetailsRepository repository, UserManager<AppUser> userManager)
    {
        _repository = repository;
        _userManager = userManager;
    }

    public async  Task<CreateCompanyDetailsResponse> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.AppUserId);

        if (user == null)
            throw new Exception("User not found.");

        var companyExist = await _repository.ExistsAsync(request.AppUserId, cancellationToken);

        CompanyTable result;

        try
        {
            if (companyExist)
            {
                var compDetails = await _repository.GetCompanyDetailsById(request.AppUserId, cancellationToken);

                compDetails.AppUserId = request.AppUserId;
                compDetails.CompanyName = request.CompanyName;
                compDetails.TaxNumber = request.TaxNumber;
                compDetails.ActivitySectorId = request.ActivitySectorId;
                compDetails.EmployeeCountId = request.EmployeeCountId;
                compDetails.CountryId = request.CountryId;
                compDetails.Provincy = request.Provincy;
                compDetails.Municipality = request.Municipality;
                compDetails.PersonResponsible = request.PersonResponsible;
                compDetails.Position = request.Position;
                compDetails.CorporateEmail = request.CorporateEmail;
                compDetails.Phone = request.Phone;
                compDetails.AboutCompany = request.AboutCompany;

                result = await _repository.UpdateCompanyDetails(compDetails, cancellationToken);
            }
            else
            {
                var companyDetails = new CompanyTable
                {
                    CompanyId = Guid.NewGuid(),
                    AppUserId = request.AppUserId,
                    CompanyName = request.CompanyName,
                    TaxNumber = request.TaxNumber,
                    ActivitySectorId = request.ActivitySectorId,
                    EmployeeCountId = request.EmployeeCountId,
                    CountryId = request.CountryId,
                    Provincy = request.Provincy,
                    Municipality = request.Municipality,
                    PersonResponsible = request.PersonResponsible,
                    Position = request.Position,
                    CorporateEmail = request.CorporateEmail,
                    Phone = request.Phone,
                    AboutCompany = request.AboutCompany
                };
                result = await _repository.CreateAsync(companyDetails, cancellationToken);                
            }

            await _repository.CompanyInterestsAsync(result.CompanyId, request.AppUserId,request.InterestIds,cancellationToken);
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERRO EF: " + ex.Message);
            Console.WriteLine("INNER: " + ex.InnerException?.Message);
            throw;
        }

        return new CreateCompanyDetailsResponse(
            result.CompanyId,
            result.AppUserId,
            result.CreatedDate
        );
    }
}
