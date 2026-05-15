namespace Application.Empregangola.Features.UserDetails.Commands.UpdateUserDetails;

public record UpdateUserDetailsResponse
(
    Guid Id,
    string AppUserId,
    DateTime DateOfBirth,
    string Address,
    string PostalCode,
    string Country,
    string Location,
    string PhotoProfile,
    DateTime CreatedDate
);
