using Domain.Empregangola.Enums;

namespace Application.Empregangola.Features.Vacancy.Queries.GetMyVacancies;

public class VacancyDetailDto
{
    public int VacanciesId;
    public string Title;
    public string CategoryName;
    public VacancyStatus Status;
    public DateTime CreatedAt;
    public int? CategoryId;
    public int? ContractType;
    public int? WorkMode;
    public int? ProvinceId;
    public DateTime? Deadline;
}
