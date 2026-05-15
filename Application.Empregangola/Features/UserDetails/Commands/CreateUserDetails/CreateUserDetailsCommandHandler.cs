using Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;
using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;

namespace Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;

public class CreateUserDetailsCommandHandler : IRequestHandler<CreateUserDetailsCommand, CreateUserDetailsResponse>
{
    private readonly IUserDetailsRepository _userDetailsRepository;

    public CreateUserDetailsCommandHandler(IUserDetailsRepository userDetailsRepository)
    {
        _userDetailsRepository = userDetailsRepository;
    }

    public async Task<CreateUserDetailsResponse> Handle(CreateUserDetailsCommand request, CancellationToken cancellationToken)
    {
        var exists = await _userDetailsRepository.ExistsAsync(request.AppUserId, cancellationToken);
        if (exists)
            throw new InvalidOperationException("User details already exist for this user.");

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
            CreatedDate = DateTime.UtcNow
        };

        var result = await _userDetailsRepository.CreateAsync(userDetails, cancellationToken);

        return new CreateUserDetailsResponse(
            result.Id,
            result.AppUserId,
            result.CreatedDate
        );
    }
}
