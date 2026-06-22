using MediatR;

namespace Application.Empregangola.Features.CompanyDetails.Commands.CreateCompany;

public record CreateCompanyCommand(
        string AppUserId,
        string CompanyName,
        string TaxNumber,
        int ActivitySectorId,
        int EmployeeCountId,
        int CountryId,
        string Provincy,
        string Municipality,
        string PersonResponsible,
        string Position,
        string CorporateEmail,
        string Phone,
        List<int> InterestIds,
        string AboutCompany
    ) : IRequest<CreateCompanyDetailsResponse>;

