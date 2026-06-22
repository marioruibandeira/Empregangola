using FluentValidation;

namespace Application.Empregangola.Features.CompanyDetails.Commands.CreateCompany;

public class CreateCompanyDetailsCommandValidator : AbstractValidator<CreateCompanyCommand>
{
    public CreateCompanyDetailsCommandValidator()
    {
        RuleFor(c => c.AppUserId)
            .NotEmpty().WithMessage("AppUserId is required.");

        RuleFor(c => c.CompanyName)
            .NotEmpty().WithMessage("Nome da empresa é obrigatório")
            .MaximumLength(50).WithMessage("O nome da empresa tem que ser pelo menos 50 letras");


    }
}
