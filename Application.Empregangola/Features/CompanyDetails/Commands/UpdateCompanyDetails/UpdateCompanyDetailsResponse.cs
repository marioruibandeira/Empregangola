namespace Application.Empregangola.Features.CompanyDetails.Commands.UpdateCompanyDetails;

public record UpdateCompanyDetailsResponse
(
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
    string AboutCompany,
    string AppUserId
);