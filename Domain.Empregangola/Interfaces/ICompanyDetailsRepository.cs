using Domain.Empregangola.Entities;

namespace Domain.Empregangola.Interfaces;

public interface ICompanyDetailsRepository
{
    Task<bool> ExistsAsync(string appUserId, CancellationToken cancellationToken); 
    Task<CompanyTable> CreateAsync(CompanyTable companyDetails, CancellationToken cancellation);
    Task<CompanyTable> GetCompanyDetailsById(string appUserId, CancellationToken cancellationToken);
    Task<CompanyTable> UpdateCompanyDetails(CompanyTable companyTable, CancellationToken cancellationToken);
    Task CompanyInterestsAsync(Guid companyId, string appUserId, List<int> interestIds, CancellationToken cancellationToken);
    Task<List<int>> GetInterestIdsByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken);
}
