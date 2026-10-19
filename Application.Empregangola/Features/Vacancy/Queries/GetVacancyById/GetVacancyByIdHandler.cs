using Domain.Empregangola.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Empregangola.Features.Vacancy.Queries.GetVacancyById;

public class GetVacancyByIdHandler : IRequestHandler<GetVacancyByIdQuery, VacancyDetailDto?>
{
    private readonly IVacanciesRepository _repository;

    public GetVacancyByIdHandler(IVacanciesRepository repository)
    {
        _repository = repository;
    }

    public async Task<VacancyDetailDto?> Handle(GetVacancyByIdQuery request, CancellationToken cancellationToken)
    {
        var companyId = await _repository.GetCompanyIdByUserAsync(request.AppUserId, cancellationToken);
        if (companyId is null)
            return null;

        var v = await _repository.GetByIdAsync(request.VacanciesId, companyId.Value, cancellationToken);
        if (v is null)
            return null;

        return new VacancyDetailDto(
            v.VacanciesId,
            v.Title,
            v.Category?.Name ?? string.Empty,
            v.CategoryId,
            v.NumberOfVacancies,
            (int?)v.ContractType,
            (int?)v.WorkMode,
            v.Province?.Name ?? string.Empty,
            v.ProvinceId,
            v.Municipality,
            v.Diaspora,
            v.Description,
            (int)v.EducationLevel,
            (int)v.MinimumExperience,
            v.SalaryMin,
            v.SalaryMax,
            v.NegotiableSalary,
            v.Deadline,
            (int)v.ApplicationMethod,
            v.ApplicationTarget ?? string.Empty,
            (int)v.Status,
            v.CreatedAt,
            v.UpdatedAt,
            v.Responsibilities.OrderBy(r => r.Order).Select(r => r.Description).ToList(),
            v.Requirements.OrderBy(r => r.Order).Select(r => r.Description).ToList(),
            v.Skills.Select(s => s.Skill).ToList(),
            v.Benefits.Select(b => b.Benefit).ToList(),
            v.Languages.Select(l => l.Name).ToList());
    }
}
