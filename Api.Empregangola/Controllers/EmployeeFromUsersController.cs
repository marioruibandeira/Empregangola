using Application.Empregangola.Common.Exceptions;
using Application.Empregangola.Features.Administration.Employee.Commands.CreateEmployeeFromUsers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Empregangola.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeFromUsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmployeeFromUsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateEmployeeFromUser([FromBody] CreateEmployeeFromUsersCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
             ?? User.FindFirstValue("sub");

        if (userId is null)
            return Unauthorized();

        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(CreateEmployeeFromUser), new { id = result.EmployeeId }, result);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ConflictException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
