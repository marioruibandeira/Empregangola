using Domain.Empregangola.Enums;
using FluentValidation;

namespace Application.Empregangola.Features.Vacancy.Commands.CreateVacancy;

public class CreateVacanciesCommandValidator : AbstractValidator<CreateVacanciesCommand>
{
    public CreateVacanciesCommandValidator()
    {
        // =============================================================
        //  GRUPO 1: valem SEMPRE (rascunho ou não)
        //  Protegem a base de dados: tamanhos, valores de enum, listas.
        // =============================================================

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("O título é obrigatório.")
            .MinimumLength(3).WithMessage("O título deve ter pelo menos 3 caracteres.")
            .MaximumLength(80).WithMessage("O título não pode ter mais de 80 caracteres.");

        RuleFor(x => x.Municipality)
            .MaximumLength(100).WithMessage("O município não pode ter mais de 100 caracteres.");

        RuleFor(x => x.Description)
            .MaximumLength(5000).WithMessage("A descrição não pode ter mais de 5000 caracteres.");

        RuleFor(x => x.ApplicationTarget)
            .MaximumLength(200).WithMessage("O email ou link não pode ter mais de 200 caracteres.");

        RuleFor(x => x.NumberOfVacancies)
            .InclusiveBetween(1, 50).WithMessage("O número de vagas deve estar entre 1 e 50.");

        // Os enums, quando vêm preenchidos, têm de ter um valor que exista
        RuleFor(x => x.ContractType!.Value)
            .IsInEnum().WithMessage("O tipo de contrato não é válido.")
            .When(x => x.ContractType.HasValue);

        RuleFor(x => x.WorkMode!.Value)
            .IsInEnum().WithMessage("A modalidade não é válida.")
            .When(x => x.WorkMode.HasValue);

        RuleFor(x => x.EducationLevel)
            .IsInEnum().WithMessage("O nível de escolaridade não é válido.");

        RuleFor(x => x.ExperienceLevel)
            .IsInEnum().WithMessage("A experiência mínima não é válida.");

        RuleFor(x => x.ApplicationMethod)
            .IsInEnum().WithMessage("A forma de candidatura não é válida.");

        // O salário não pode ser negativo
        RuleFor(x => x.SalaryMin)
            .GreaterThanOrEqualTo(0).WithMessage("O salário mínimo não pode ser negativo.")
            .When(x => x.SalaryMin.HasValue);

        RuleFor(x => x.SalaryMax)
            .GreaterThanOrEqualTo(0).WithMessage("O salário máximo não pode ser negativo.")
            .When(x => x.SalaryMax.HasValue);

        // As listas não podem chegar nulas, senão o handler rebenta no .Select
        RuleFor(x => x.Responsibilities).NotNull().WithMessage("As responsabilidades são inválidas.");
        RuleFor(x => x.Requirements).NotNull().WithMessage("Os requisitos são inválidos.");
        RuleFor(x => x.Skills).NotNull().WithMessage("As competências são inválidas.");
        RuleFor(x => x.Benefits).NotNull().WithMessage("Os benefícios são inválidos.");
        RuleFor(x => x.Languages).NotNull().WithMessage("Os idiomas são inválidos.");

        // =============================================================
        //  GRUPO 2: só valem quando NÃO é rascunho
        //  Regras de negócio: a vaga tem de estar completa e coerente.
        // =============================================================

        When(x => !x.IsDraft, () =>
        {
            RuleFor(x => x.CategoryId)
                .NotNull().WithMessage("A categoria é obrigatória.")
                .GreaterThan(0).WithMessage("A categoria é obrigatória.");

            RuleFor(x => x.ProvinceId)
                .NotNull().WithMessage("A província é obrigatória.")
                .GreaterThan(0).WithMessage("A província é obrigatória.");

            RuleFor(x => x.ContractType)
                .NotNull().WithMessage("O tipo de contrato é obrigatório.");

            RuleFor(x => x.WorkMode)
                .NotNull().WithMessage("A modalidade é obrigatória.");

            RuleFor(x => x.Municipality)
                .NotEmpty().WithMessage("O município é obrigatório.")
                .MinimumLength(3).WithMessage("O município deve ter pelo menos 3 caracteres.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("A descrição é obrigatória.");

            RuleFor(x => x.Deadline)
                .NotNull().WithMessage("O prazo limite é obrigatório.")
                .Must(d => d is null || d.Value.Date >= DateTime.UtcNow.Date)
                .WithMessage("O prazo limite não pode estar no passado.");

            // O salário máximo não pode ser inferior ao mínimo (excepto "a combinar")
            RuleFor(x => x.SalaryMax)
                .GreaterThanOrEqualTo(x => x.SalaryMin!.Value)
                .WithMessage("O salário máximo não pode ser inferior ao mínimo.")
                .When(x => !x.NegotiableSalary && x.SalaryMin.HasValue && x.SalaryMax.HasValue);

            // O destino da candidatura depende do método escolhido
            When(x => x.ApplicationMethod == ApplicationMethod.Email, () =>
            {
                RuleFor(x => x.ApplicationTarget)
                    .NotEmpty().WithMessage("Indique o email para candidaturas.")
                    .EmailAddress().WithMessage("O email para candidaturas não é válido.");
            });

            When(x => x.ApplicationMethod == ApplicationMethod.Link, () =>
            {
                RuleFor(x => x.ApplicationTarget)
                    .NotEmpty().WithMessage("Indique o link para candidaturas.")
                    .Must(BeValidHttpUrl).WithMessage("O link para candidaturas deve começar por http:// ou https://.");
            });
        });
    }

    private static bool BeValidHttpUrl(string? valor)
    {
        return Uri.TryCreate(valor, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}