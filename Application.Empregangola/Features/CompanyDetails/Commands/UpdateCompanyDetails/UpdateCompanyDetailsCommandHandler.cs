using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;

namespace Application.Empregangola.Features.CompanyDetails.Commands.UpdateCompanyDetails;

public class UpdateCompanyDetailsCommandHandler : IRequestHandler<UpdateCompanyDetailsCommand, UpdateCompanyDetailsResponse>
{
    private readonly ICompanyDetailsRepository _repository;

    public UpdateCompanyDetailsCommandHandler(ICompanyDetailsRepository repository) 
    {
        _repository = repository;
    }

    public async Task<UpdateCompanyDetailsResponse> Handle(UpdateCompanyDetailsCommand command, CancellationToken cancellationToken)
    {
        var companyDetails = await _repository.GetCompanyDetailsById(command.Id, cancellationToken);

        if(companyDetails == null)
            throw new Exception("Company details not found.");

        companyDetails.CompanyName = command.CompanyName;
        companyDetails.TaxNumber = command.TaxNumber;
        companyDetails.ActivitySectorId = command.ActivitySectorId;
        companyDetails.EmployeeCountId = command.EmployeeCountId;
        companyDetails.CountryId = command.CountryId;
        companyDetails.Provincy = command.Provincy;
        companyDetails.Municipality = command.Municipality;
        companyDetails.PersonResponsible = command.PersonResponsible;
        companyDetails.CorporateEmail = command.CorporateEmail;
        companyDetails.Phone = command.Phone;
        companyDetails.AboutCompany = command.AboutCompany;
        companyDetails.AppUserId = command.AppUserId;
        companyDetails.Position = command.Position;

        var result = await _repository.UpdateCompanyDetails(companyDetails, cancellationToken);

        return new UpdateCompanyDetailsResponse(
                result.CompanyName,
                result.TaxNumber,
                result.ActivitySectorId,
                result.EmployeeCountId,
                result.CountryId,
                result.Provincy,
                result.Municipality,
                result.PersonResponsible,
                result.CorporateEmail,
                result.Phone,
                result.AboutCompany,
                result.AppUserId,
                result.Position
            );
    }
}
