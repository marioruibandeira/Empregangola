using Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;
using Application.Empregangola.Features.UserDetails.Commands.UpdateUserDetails;
using Application.Empregangola.Features.UserDetails.Queries.GetUserDetails;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

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

    [HttpGet("{appUserId}")]
    public async Task<IActionResult> GetUserDetails(string appUserId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetUserProfileQuery(appUserId), cancellationToken);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    /*
    [HttpPut(Name = "UpdateUserDetails")]
    [ProducesResponseType(typeof(UpdateUserDetailsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUserDetails([FromBody] UpdateUserDetailsCommand command) 
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }*/

}