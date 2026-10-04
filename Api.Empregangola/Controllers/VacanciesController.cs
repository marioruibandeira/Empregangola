using Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;
using Application.Empregangola.Features.Vacancy.Commands.CreateVacancy;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;

namespace Api.Empregangola.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VacanciesController : ControllerBase
{
    private readonly IMediator _mediator;
    public VacanciesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateVacancy([FromBody] CreateVacanciesCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(CreateVacancy), new { id = result.VacanciesId }, result);
    }
}
