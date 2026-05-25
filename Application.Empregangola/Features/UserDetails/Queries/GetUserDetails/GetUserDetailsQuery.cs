using MediatR;

namespace Application.Empregangola.Features.UserDetails.Queries.GetUserDetails;

public record GetUserProfileQuery(string UserId) : IRequest<UserDetailsDto>;