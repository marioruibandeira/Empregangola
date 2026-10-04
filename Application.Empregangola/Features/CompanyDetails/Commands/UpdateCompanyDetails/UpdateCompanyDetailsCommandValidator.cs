using FluentValidation;

namespace Application.Empregangola.Features.CompanyDetails.Commands.UpdateCompanyDetails;

public class UpdateCompanyDetailsCommandValidator : AbstractValidator<UpdateCompanyDetailsResponse>
{
    public UpdateCompanyDetailsCommandValidator()
    {
        RuleFor(x => x.AppUserId)
            .NotEmpty().WithMessage("AppUserId is required.");
    }
}
