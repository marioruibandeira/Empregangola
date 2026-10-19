using Application.Empregangola.Common;
using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.Design;

namespace Application.Empregangola.Features.Vacancy.Commands.CreateVacancy;

public class CreateVacanciesHandler : IRequestHandler<CreateVacanciesCommand, CreateVacanciesResponse>
{
    private readonly IVacanciesRepository _vacancyepository;
    private readonly UserManager<AppUser> _userManager;

    public CreateVacanciesHandler(IVacanciesRepository vacancyepository, UserManager<AppUser> userManager)
    {
        _vacancyepository = vacancyepository;
        _userManager = userManager;
    }

    public async Task<CreateVacanciesResponse> Handle(CreateVacanciesCommand request, CancellationToken cancellationToken)
    {
        var Status = VacancyStatus.Open;
        var CreatedAt = DateTime.UtcNow;

        var vacancyExist = await _vacancyepository.ExistsAsync(request.Title, cancellationToken);

        if (vacancyExist)
        {
            throw new InvalidOperationException($"Já existe uma vaga com o título '{request.Title}'.");
        }

        var companyId = await _vacancyepository.GetCompanyIdByUserAsync(request.AppUserId!, cancellationToken)
            ?? throw new InvalidOperationException("O utilizador não tem nenhuma empresa associada.");

        var nomesIdiomas = request.Languages
        .Select(l => l.Trim())
        .Where(l => l.Length > 0)
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToList();

        var idiomas = await _vacancyepository.GetLanguagesByNamesAsync(nomesIdiomas, cancellationToken);


        var vacancies = new VacanciesTable
        {
            CompanyId = companyId,
            Title = request.Title,
            CategoryId = request.CategoryId,
            NumberOfVacancies = request.NumberOfVacancies,
            ContractType = request.ContractType,
            WorkMode = request.WorkMode,
            ProvinceId = request.ProvinceId,
            Municipality = request.Municipality?.Trim() ?? string.Empty,
            Diaspora = request.Diaspora,
            Description = request.Description ?? string.Empty,
            EducationLevel = request.EducationLevel,
            MinimumExperience = request.ExperienceLevel,
            SalaryMin = request.SalaryMin,
            SalaryMax = request.SalaryMax,
            NegotiableSalary = request.NegotiableSalary,
            Deadline = request.Deadline,
            ApplicationMethod = request.ApplicationMethod,
            ApplicationTarget = request.ApplicationTarget ?? string.Empty,
            Status = request.IsDraft ? VacancyStatus.Draft : VacancyStatus.Open,
            CreatedAt = CreatedAt,

            Languages = idiomas,

            Responsibilities = request.Responsibilities
                .Select((desc, index) => new VacancyResponsibilitiesTable { Description = desc, Order = index + 1 })
                .ToList(),

            Requirements = request.Requirements
                .Select((desc, index) => new VacancyRequirementsTable { Description = desc, Order = index + 1 })
                .ToList(),

            Skills = request.Skills
                .Select(skill => new VacancySkillsTable { Skill = skill })
                .ToList(),

            Benefits = request.Benefits
                .Select(benefit => new VacancyBenefitsTable { Benefit = benefit })
                .ToList()
        };

        var result = await _vacancyepository.CreateAsync(vacancies, cancellationToken);

        return new CreateVacanciesResponse(
            VacanciesId: result.VacanciesId,
            CompanyId: result.CompanyId,
            CompanyName: result.Company?.CompanyName,
            Title: result.Title,
            CategoryId: result.CategoryId,
            CategoryName: result.Category?.Name,
            NumberOfVacancies: result.NumberOfVacancies,
            ContractType: result.ContractType,
            WorkMode: result.WorkMode,
            ProvinceId: result.ProvinceId,
            ProvinceName: result.Province?.Name,
            Municipality: result.Municipality?.Trim() ?? string.Empty,
            Diaspora: result.Diaspora,
            Description: result.Description ?? string.Empty,
            EducationLevel: result.EducationLevel,
            ExperienceLevel: result.MinimumExperience,
            SalaryMin: result.SalaryMin,
            SalaryMax: result.SalaryMax,
            NegotiableSalary: result.NegotiableSalary,
            Deadline: result.Deadline,
            ApplicationMethod: result.ApplicationMethod,
            ApplicationTarget: result.ApplicationTarget ?? string.Empty,
            Status: request.IsDraft ? VacancyStatus.Draft : VacancyStatus.Open,
            CreatedAt: result.CreatedAt,
            UpdatedAt: result.UpdatedAt,
            Responsibilities: result.Responsibilities.OrderBy(r => r.Order).Select(r => r.Description).ToList(),
            Requirements: result.Requirements.OrderBy(r => r.Order).Select(r => r.Description).ToList(),
            Skills: result.Skills.Select(s => s.Skill).ToList(),
            Benefits: result.Benefits.Select(b => b.Benefit).ToList(),
            Languages: result.Languages.Select(l => l.Name).ToList()
        );
    }
}
