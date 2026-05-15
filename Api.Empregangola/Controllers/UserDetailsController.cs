using Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;
using Application.Empregangola.Features.UserDetails.Commands.UpdateUserDetails;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Empregangola.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserDetailsController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserDetailsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUserDetails([FromBody] CreateUserDetailsCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(CreateUserDetails), new {id = result.Id }, result);
    }

    [HttpPut(Name = "UpdateUserDetails")]
    [ProducesResponseType(typeof(UpdateUserDetailsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUserDetails([FromBody] UpdateUserDetailsCommand command) 
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

}