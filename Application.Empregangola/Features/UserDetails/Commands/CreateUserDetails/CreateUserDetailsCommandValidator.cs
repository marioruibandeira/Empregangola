using FluentValidation;

namespace Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;

public class CreateUserDetailsCommandValidator : AbstractValidator<CreateUserDetailsCommand>
{
    public CreateUserDetailsCommandValidator()
    {
        RuleFor(x => x.AppUserId)
            .NotEmpty().WithMessage("AppUserId is required.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required.")
            .LessThan(_ => DateTime.UtcNow.AddYears(-18)).WithMessage("User must be at least 18 years old.");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required.")
            .MaximumLength(200).WithMessage("Address must not exceed 200 characters.");

        RuleFor(x => x.PostalCode)
            .NotEmpty().WithMessage("Postal code must not exceed 20 characters.");

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country must not exceed 100 characters.")
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters.");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location must not exceed 100 characters.")
            .MaximumLength(100).WithMessage("Location must not exceed 100 characters.");

        RuleFor(x => x.PhotoProfile)
            .MaximumLength(500).WithMessage("Photo profile URL must not exceed 500 characters.");

        RuleFor(x => x.SobreMim)
            .MaximumLength(500).WithMessage("Sobre mim cannot exceed 500 characters.");
    }
}
