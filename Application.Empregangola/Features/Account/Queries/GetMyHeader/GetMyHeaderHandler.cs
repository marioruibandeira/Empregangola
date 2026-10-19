using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Empregangola.Features.Account.Queries.GetMyHeader;

public record GetMyHeaderQuery(string AppUserId) : IRequest<MyHeaderDto>;
public record MyHeaderDto(string CompanyName, string UserName, DateTime? LastLogin);

public class GetMyHeaderHandler : IRequestHandler<GetMyHeaderQuery, MyHeaderDto>
{
    private readonly IVacanciesRepository _repository;
    private readonly UserManager<AppUser> _userManager;

    public GetMyHeaderHandler(IVacanciesRepository repository, UserManager<AppUser> userManager)
    {
        _repository = repository;
        _userManager = userManager;
    }

    public async Task<MyHeaderDto> Handle(GetMyHeaderQuery request, CancellationToken cancellationToken)
    {
        var empresa = await _repository.GetCompanyNameByUserAsync(request.AppUserId, cancellationToken)
                      ?? string.Empty;

        var user = await _userManager.FindByIdAsync(request.AppUserId);
        var nome = !string.IsNullOrWhiteSpace(user?.FullName)
            ? user!.FullName!
            : user?.UserName ?? string.Empty;

        return new MyHeaderDto(empresa, nome, null);
    }
}
