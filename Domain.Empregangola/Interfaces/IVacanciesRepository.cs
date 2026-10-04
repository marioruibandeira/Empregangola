using Domain.Empregangola.Entities;

namespace Domain.Empregangola.Interfaces;

public interface IVacanciesRepository
{
    Task<VacanciesTable> CreateAsync(VacanciesTable vacancies, CancellationToken cancellation);
    Task<bool> ExistsAsync(string titulo, CancellationToken cancellationToken);
}
