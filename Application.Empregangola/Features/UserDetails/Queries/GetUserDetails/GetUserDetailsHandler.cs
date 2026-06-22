using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Empregangola.Features.UserDetails.Queries.GetUserDetails;

public class GetUserDetailsHandler : IRequestHandler<GetUserProfileQuery, UserDetailsDto>
{
    private readonly IUserDetailsRepository _repository;
    private readonly UserManager<AppUser> _userManager;

    public GetUserDetailsHandler(IUserDetailsRepository repository, UserManager<AppUser> userManager)
    {
        _repository = repository;
        _userManager = userManager;
    }

    public async Task<UserDetailsDto> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        var details = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);

        if (user == null)
            return null;

        if (details != null)
        {
            return new UserDetailsDto
            {
                AppUserId = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = details.Address,
                PostalCode = details.PostalCode,
                Country = details.Country,
                Location = details.Location,
                DateOfBirth = details.DateOfBirth,
                PhotoProfile = details.PhotoProfile,
                Genero = details.Genero,
                SobreMim = details.SobreMim,
            };
        }

        return null;
    }
}