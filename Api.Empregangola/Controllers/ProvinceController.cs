using Application.Empregangola.Features.Shared.Queries.GetProvince;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Empregangola.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProvinceController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProvinceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllProvincesQuery(), cancellationToken);
        return Ok(result);
    }
}