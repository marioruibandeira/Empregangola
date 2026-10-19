using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;

namespace Application.Empregangola.Features.UserDetails.Queries.GetUsers;

public class GetUsersHandler : IRequestHandler<GetUsersQuery, List<UsersListDto>>
{
    private readonly IUserDetailsRepository _repository;
    private readonly UserManager<AppUser> _userManager;

    public GetUsersHandler(IUserDetailsRepository repository, UserManager<AppUser> userManager)
    {
        _repository = repository;
        _userManager = userManager;
    }

    public async Task<List<UsersListDto>> Handle(GetUsersQuery query, CancellationToken cancellationToken)
    {
        var usuarios = await _userManager.Users.ToListAsync();

        return usuarios
            .Select(v => new UsersListDto(
                    v.Id,
                    v.UserName,
                    v.FullName,
                    v.PhoneNumber,
                    v.Email
                ))
            .ToList();
    }
}
