using Application.Empregangola.Features.Vacancy.JobApplication.Commands.CreateJobApplication;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Empregangola.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobApplicationController : ControllerBase
{
    private readonly IMediator _mediator;

    public JobApplicationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateJobApplication([FromBody] CreateJobApplicationCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                 ?? User.FindFirstValue("sub");

        if (userId is null)
            return Unauthorized();

        var result = await _mediator.Send(command with { AppUserId = userId });
        return CreatedAtAction(nameof(CreateJobApplication), new { id = result.VacancyId }, result);
    }
}
