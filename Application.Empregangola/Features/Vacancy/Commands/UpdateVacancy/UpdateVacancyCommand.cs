using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;
using Domain.Empregangola.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Empregangola.Features.Vacancy.Commands.UpdateVacancy;

public enum UpdateVacancyOutcome { Updated, NotFound, NotAllowed }

public record UpdateVacancyCommand(
    int VacanciesId,
    string Title,
    int CategoryId,
    int NumberOfVacancies,
    EmploymentType ContractType,
    WorkMode WorkMode,
    int ProvinceId,
    string Municipality,
    bool Diaspora,
    string Description,
    EducationLevel EducationLevel,
    MinimumExperience ExperienceLevel,
    decimal? SalaryMin,
    decimal? SalaryMax,
    bool NegotiableSalary,
    DateTime Deadline,
    ApplicationMethod ApplicationMethod,
    string ApplicationTarget,
    List<string> Responsibilities,
    List<string> Requirements,
    List<string> Skills,
    List<string> Benefits,
    List<string> Languages,
    string? AppUserId = null
) : IRequest<UpdateVacancyOutcome>;
