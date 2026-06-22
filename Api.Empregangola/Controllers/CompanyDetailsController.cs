using Application.Empregangola.Features.CompanyDetails.Commands.CreateCompany;
using Application.Empregangola.Features.CompanyDetails.Queries.GetCompanyDetails;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Empregangola.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompanyDetailsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CompanyDetailsController(IMediator mediator) 
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCompanyDetails([FromBody] CreateCompanyCommand command) 
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(CreateCompanyDetails), new { id = result.CompanyId }, result);
    }

    [HttpGet("{appUserId}")]
    public async Task<IActionResult> GetEmpresaDetails(string appUserId, CancellationToken cancellationToken) 
    {
        var result = await _mediator.Send(new GetCompanyProfileQuery(appUserId), cancellationToken);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

}
