namespace Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;
public record CreateUserDetailsResponse(
    Guid Id,
    string AppUserId,
    DateTime CreateDate
);

