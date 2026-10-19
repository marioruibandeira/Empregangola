using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;

namespace Domain.Empregangola.Interfaces;

public interface IVacanciesRepository
{
    Task<VacanciesTable> CreateAsync(VacanciesTable vacancies, CancellationToken cancellation);
    Task<bool> ExistsAsync(string titulo, CancellationToken cancellationToken);
    Task<Guid?> GetCompanyIdByUserAsync(string appUserId, CancellationToken cancellationToken);
    Task<List<LanguagesTable>> GetLanguagesByNamesAsync(IEnumerable<string> names, CancellationToken cancellationToken);
    Task<List<VacanciesTable>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken);
    Task<VacanciesTable?> GetByIdAsync(int vacanciesId, Guid companyId, CancellationToken cancellationToken);
    Task<VacancyStatus?> GetStatusAsync(int vacanciesId, Guid companyId, CancellationToken cancellationToken);
    Task<bool> PublishAsync(int vacanciesId, Guid companyId, CancellationToken cancellationToken);
    Task<string?> GetCompanyNameByUserAsync(string appUserId, CancellationToken cancellationToken);
    Task<VacanciesTable?> GetForUpdateAsync(int vacanciesId, Guid companyId, CancellationToken cancellationToken);
    Task UpdateAsync(VacanciesTable vacancy, CancellationToken cancellationToken);
    Task<(List<VacanciesTable> Items, int Total)> GetPublicAsync(
    string? search, int? categoryId, int? provinceId, int? contractType,
    int page, int pageSize, CancellationToken cancellationToken);
    Task<VacanciesTable?> GetPublicByIdAsync(int vacanciesId, CancellationToken cancellationToken);
}
