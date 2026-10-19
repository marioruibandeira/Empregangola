using Application.Empregangola.Features.UserDetails.Commands.CreateUserDetails;
using Application.Empregangola.Features.Vacancy.Commands.CreateVacancy;
using Application.Empregangola.Features.Vacancy.Commands.PublishVacancy;
using Application.Empregangola.Features.Vacancy.Commands.UpdateVacancy;
using Application.Empregangola.Features.Vacancy.Queries.GetMyVacancies;
using Application.Empregangola.Features.Vacancy.Queries.GetVacancyById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                 ?? User.FindFirstValue("sub");

        if (userId is null)
            return Unauthorized();

        var result = await _mediator.Send(command with { AppUserId = userId }) ;
        return CreatedAtAction(nameof(CreateVacancy), new { id = result.VacanciesId }, result);
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

        if (userId is null)
            return Unauthorized();

        var result = await _mediator.Send(new GetMyVacanciesQuery(userId));
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

        if (userId is null)
            return Unauthorized();

        var result = await _mediator.Send(new GetVacancyByIdQuery(id, userId));
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("{id:int}/publish")]
    public async Task<IActionResult> Publish(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

        if (userId is null)
            return Unauthorized();

        var resultado = await _mediator.Send(new PublishVacancyCommand(id, userId));

        return resultado switch
        {
            PublishVacancyOutcome.Published => Ok(new { status = 3 }),
            PublishVacancyOutcome.NotFound => NotFound(),
            _ => Conflict(new { message = "Só é possível publicar vagas que estão em aberto." })
        };
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateVacancyCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

        if (userId is null)
            return Unauthorized();

        var resultado = await _mediator.Send(command with { VacanciesId = id, AppUserId = userId });

        return resultado switch
        {
            UpdateVacancyOutcome.Updated => NoContent(),
            UpdateVacancyOutcome.NotFound => NotFound(),
            _ => Conflict(new { message = "Não é possível editar uma vaga encerrada." })
        };
    }
}
