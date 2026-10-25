using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.Empregangola.Features.Vacancy.JobApplication.Commands.CreateJobApplication;

public record CreateJobApplicationCommand(
        bool UseProfileCv,
        string? NewCv,
        string? PresentationLetter,
        decimal? SalaryPretention,
        StartAvailability? StartAvailability,
        bool ShareCv,
        DateTime AppliedDate,
        string AppUserId,
        int VacancyId
    ): IRequest<CreateJobApplicationResponse>;