namespace Application.Empregangola.Features.CompanyDetails.Commands.CreateCompany;

public record CreateCompanyDetailsResponse(
        Guid CompanyId,
        string AppUserId,
        DateTime CreateDate
    );