using Application.Empregangola.Common.Exceptions;
using Domain.Empregangola.Entities;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Empregangola.Features.Administration.Employee.Commands.CreateEmployeeFromUsers;

public class CreateEmployeeFromUsersHandler : IRequestHandler<CreateEmployeeFromUsersCommand, CreateEmployeeFromUsersResponse>
{
    private readonly IEmployeeFromUsersRepository _employeeFromUsers;
    private readonly UserManager<AppUser> _userManager;

    public CreateEmployeeFromUsersHandler(IEmployeeFromUsersRepository employeeFromUsers, UserManager<AppUser> userManager)
    {
        _employeeFromUsers = employeeFromUsers;
        _userManager = userManager;
    }

    public async Task<CreateEmployeeFromUsersResponse> Handle(CreateEmployeeFromUsersCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.AppUserId);

        if (user == null)
            throw new NotFoundException("Utilizador não encontrado.");

        var employeeExists = await _employeeFromUsers.ExistsAsync(request.AppUserId, cancellationToken);

        if (employeeExists)

            throw new ConflictException("Funcionário já existe.");

        var employee = new EmployeeTable
        {
            AppUserId = request.AppUserId,
            CreatedDate = DateTime.UtcNow
        };

        var result = await _employeeFromUsers.CreateAsync(employee, cancellationToken);

        return new CreateEmployeeFromUsersResponse(
            result.EmployeeId,
            result.AppUserId,
            result.CreatedDate
        );
    }
}
