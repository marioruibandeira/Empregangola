using MediatR;

namespace Application.Empregangola.Features.UserDetails.Queries.GetUsers;

public record GetUsersQuery() : IRequest<List<UsersListDto>>;

public record UsersListDto(
        string AppUserId ,
        string UserName,
        string FullName,
        string PhoneNumber,
        string Email
    );
