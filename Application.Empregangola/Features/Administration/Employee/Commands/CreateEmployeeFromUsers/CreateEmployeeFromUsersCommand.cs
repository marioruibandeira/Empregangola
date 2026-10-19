using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.Empregangola.Features.Administration.Employee.Commands.CreateEmployeeFromUsers;

public record CreateEmployeeFromUsersCommand(
    int EmployeeId,
    string AppUserId,
    //string? AppUser,
    string? FullName,
    DateTime? DateOfBirth,
    Gender? Gender,
    MaritalStatus? MaritalStatus,
    int? NationalityId,
    string? NationalityCountry,
    string? PlaceOfBirth,
    DateTime CreatedDate
) : IRequest<CreateEmployeeFromUsersResponse>;
