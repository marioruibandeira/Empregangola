using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;
using Domain.Empregangola.Interfaces;
using MediatR;

namespace Application.Empregangola.Features.Vacancy.Commands.UpdateVacancy;

public class UpdateVacancyHandler : IRequestHandler<UpdateVacancyCommand, UpdateVacancyOutcome>
{
    private readonly IVacanciesRepository _repository;

    public UpdateVacancyHandler(IVacanciesRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdateVacancyOutcome> Handle(UpdateVacancyCommand request, CancellationToken cancellationToken)
    {
        var companyId = await _repository.GetCompanyIdByUserAsync(request.AppUserId!, cancellationToken);
        if (companyId is null)
            return UpdateVacancyOutcome.NotFound;

        var v = await _repository.GetForUpdateAsync(request.VacanciesId, companyId.Value, cancellationToken);
        if (v is null)
            return UpdateVacancyOutcome.NotFound;

        if (v.Status == VacancyStatus.Closed)
            return UpdateVacancyOutcome.NotAllowed;

        if (v.Status == VacancyStatus.Draft)
        {
            v.Status = VacancyStatus.Open;
        }

        // Numa vaga publicada, estes campos ficam bloqueados
        if (v.Status != VacancyStatus.Published)
        {
            v.Title = request.Title.Trim();
            v.CategoryId = request.CategoryId;
            v.NumberOfVacancies = request.NumberOfVacancies;
            v.ContractType = request.ContractType;
            v.WorkMode = request.WorkMode;
            v.ProvinceId = request.ProvinceId;
            v.Municipality = request.Municipality.Trim();
            v.Diaspora = request.Diaspora;
            v.EducationLevel = request.EducationLevel;
            v.MinimumExperience = request.ExperienceLevel;
            v.SalaryMin = request.NegotiableSalary ? null : request.SalaryMin;
            v.SalaryMax = request.NegotiableSalary ? null : request.SalaryMax;
            v.NegotiableSalary = request.NegotiableSalary;
        }

        // Editáveis em qualquer estado
        v.Description = request.Description;
        v.Deadline = request.Deadline;
        v.ApplicationMethod = request.ApplicationMethod;
        v.ApplicationTarget = request.ApplicationTarget;
        v.UpdatedAt = DateTime.UtcNow;

        // Listas: substitui tudo (as antigas são apagadas pelo EF)
        v.Responsibilities.Clear();
        foreach (var (desc, i) in request.Responsibilities.Select((d, i) => (d, i)))
            v.Responsibilities.Add(new VacancyResponsibilitiesTable { Description = desc, Order = i + 1 });

        v.Requirements.Clear();
        foreach (var (desc, i) in request.Requirements.Select((d, i) => (d, i)))
            v.Requirements.Add(new VacancyRequirementsTable { Description = desc, Order = i + 1 });

        v.Skills.Clear();
        foreach (var skill in request.Skills)
            v.Skills.Add(new VacancySkillsTable { Skill = skill });

        v.Benefits.Clear();
        foreach (var benefit in request.Benefits)
            v.Benefits.Add(new VacancyBenefitsTable { Benefit = benefit });

        var nomes = request.Languages
            .Select(l => l.Trim())
            .Where(l => l.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var idiomas = await _repository.GetLanguagesByNamesAsync(nomes, cancellationToken);
        v.Languages.Clear();
        foreach (var idioma in idiomas)
            v.Languages.Add(idioma);

        await _repository.UpdateAsync(v, cancellationToken);
        return UpdateVacancyOutcome.Updated;
    }
}
