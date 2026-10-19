namespace Application.Empregangola.Features.Administration.Employee.Commands.CreateEmployeeFromUsers;

public record CreateEmployeeFromUsersResponse
(
    int EmployeeId,
    string AppUserId,
    DateTime CreateDate
);
