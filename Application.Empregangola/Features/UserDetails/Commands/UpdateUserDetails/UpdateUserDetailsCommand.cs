using MediatR;

namespace Application.Empregangola.Features.UserDetails.Commands.UpdateUserDetails;

public record UpdateUserDetailsCommand
(
    string AppUserId,
    DateTime DateOfBirth,
    string Address,
    string PostalCode,
    string Country,
    string Location,
    string PhotoProfile
) : IRequest<UpdateUserDetailsResponse>;
