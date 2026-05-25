using MediatR;

namespace Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;

public record CreateUserDetailsCommand(
    string AppUserId,
    string FullName,
    string Email,
    string PhoneNumber,
    DateTime DateOfBirth,
    string Address,
    string PostalCode,
    string Country,
    string Location,
    string PhotoProfile,
    int Genero,
    string SobreMim
) : IRequest<CreateUserDetailsResponse>;
