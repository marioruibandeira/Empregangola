using MediatR;

namespace Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;

public record CreateUserDetailsCommand(
    string AppUserId,
    DateTime DateOfBirth,
    string Address,
    string PostalCode,
    string Country,
    string Location,
    string PhotoProfile
) : IRequest<CreateUserDetailsResponse>;
