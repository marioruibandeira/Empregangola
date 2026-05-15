using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;

namespace Application.Empregangola.Features.UserDetails.Commands.UpdateUserDetails;

public class UpdateUserDetailsCommandHandler : IRequestHandler<UpdateUserDetailsCommand, UpdateUserDetailsResponse>
{
    private readonly IUserDetailsRepository _repository;

    public UpdateUserDetailsCommandHandler(IUserDetailsRepository repository) 
    { 
        _repository = repository;
    }

    public async Task<UpdateUserDetailsResponse> Handle(UpdateUserDetailsCommand command, CancellationToken cancellationToken)
    {
        var userDetails = await _repository.GetByAppUserIdAsync(command.AppUserId, cancellationToken);

        if (userDetails == null)
            throw new Exception("User details not found.");

        userDetails.DateOfBirth = command.DateOfBirth;
        userDetails.Address = command.Address;
        userDetails.PostalCode = command.PostalCode;
        userDetails.Country = command.Country;
        userDetails.Location = command.Location;
        userDetails.PhotoProfile = command.PhotoProfile;

        var result = await _repository.UpdateAsync(userDetails, cancellationToken);

        return new UpdateUserDetailsResponse(
            result.Id,
            result.AppUserId,
            result.DateOfBirth,
            result.Address,
            result.PostalCode,
            result.Country,
            result.Location,
            result.PhotoProfile,
            result.CreatedDate
        );
    }
}