using Domain.Empregangola.Entities;

namespace Domain.Empregangola.Interfaces;

public interface IJobApplicationRepository
{
    Task<bool> ExistsAsync(int vacancyId, CancellationToken cancellationToken);
    Task<JobApplicationTable> CreateAsync(JobApplicationTable application, CancellationToken cancellation);
}
