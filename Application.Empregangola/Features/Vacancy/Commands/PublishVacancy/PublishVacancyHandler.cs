using Domain.Empregangola.Enums;
using Domain.Empregangola.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Empregangola.Features.Vacancy.Commands.PublishVacancy;

public enum PublishVacancyOutcome { Published, NotFound, NotAllowed }

public record PublishVacancyCommand(int VacanciesId, string AppUserId) : IRequest<PublishVacancyOutcome>;
public class PublishVacancyHandler : IRequestHandler<PublishVacancyCommand, PublishVacancyOutcome>
{
    private readonly IVacanciesRepository _repository;

    public PublishVacancyHandler(IVacanciesRepository repository)
    {
        _repository = repository;
    }

    public async Task<PublishVacancyOutcome> Handle(PublishVacancyCommand request, CancellationToken cancellationToken)
    {
        var companyId = await _repository.GetCompanyIdByUserAsync(request.AppUserId, cancellationToken);
        if (companyId is null)
            return PublishVacancyOutcome.NotFound;

        var estado = await _repository.GetStatusAsync(request.VacanciesId, companyId.Value, cancellationToken);
        if (estado is null)
            return PublishVacancyOutcome.NotFound;

        if (estado != VacancyStatus.Open)
            return PublishVacancyOutcome.NotAllowed;

        var publicada = await _repository.PublishAsync(request.VacanciesId, companyId.Value, cancellationToken);
        return publicada ? PublishVacancyOutcome.Published : PublishVacancyOutcome.NotAllowed;
    }
}
