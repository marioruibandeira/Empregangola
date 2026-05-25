using Application.Empregangola.Common;
using Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;
using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;

public class CreateUserDetailsCommandHandler : IRequestHandler<CreateUserDetailsCommand, CreateUserDetailsResponse>
{
    private readonly IUserDetailsRepository _userDetailsRepository;
    private readonly UserManager<AppUser> _userManager;

    public CreateUserDetailsCommandHandler(IUserDetailsRepository userDetailsRepository, UserManager<AppUser> userManager)
    {
        _userDetailsRepository = userDetailsRepository;
        _userManager = userManager;
    }

    public async Task<CreateUserDetailsResponse> Handle(CreateUserDetailsCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.AppUserId);
        if(user == null)
            throw new Exception("User not found.");

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.PhoneNumber = request.PhoneNumber;

        await _userManager.UpdateAsync(user);

        UserDetailsTable result;

        var exists = await _userDetailsRepository.ExistsAsync(request.AppUserId, cancellationToken);

        if (exists)
        {
            var details = await _userDetailsRepository.GetByUserIdAsync(request.AppUserId, cancellationToken);

            details.DateOfBirth = request.DateOfBirth;
            details.Address = request.Address;
            details.PostalCode = request.PostalCode;
            details.Country = request.Country;
            details.Location = request.Location;
            details.PhotoProfile = request.PhotoProfile;
            details.Genero = request.Genero;
            details.SobreMim = request.SobreMim;

            result = await _userDetailsRepository.UpdateAsync(details, cancellationToken);
        }
        else
        {
            var userDetails = new UserDetailsTable
            {
                Id = Guid.NewGuid(),
                AppUserId = request.AppUserId,
                DateOfBirth = request.DateOfBirth,
                Address = request.Address,
                PostalCode = request.PostalCode,
                Country = request.Country,
                Location = request.Location,
                PhotoProfile = request.PhotoProfile,
                Genero = request.Genero,
                SobreMim = request.SobreMim,
                CreatedDate = DateTime.UtcNow
            };
            result = await _userDetailsRepository.CreateAsync(userDetails, cancellationToken);
        }

        return new CreateUserDetailsResponse(
            result.Id,
            result.AppUserId,
            result.CreatedDate
        );
    }
}
