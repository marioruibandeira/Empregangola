using Application.Empregangola.Features.Vacancy.Queries.GetPublicVacancies;
using Application.Empregangola.Features.Vacancy.Queries.GetPublicVacancyById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Empregangola.Controllers;

[ApiController]
[Route("api/public/vacancies")]
[AllowAnonymous]
public class PublicVacanciesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PublicVacanciesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? q,
        [FromQuery] int? categoryId,
        [FromQuery] int? provinceId,
        [FromQuery] int? contractType,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var result = await _mediator.Send(
            new GetPublicVacanciesQuery(q, categoryId, provinceId, contractType, page, pageSize));

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetPublicVacancyByIdQuery(id));
        return result is null ? NotFound() : Ok(result);
    }
}
