using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;

namespace Application.Empregangola.Features.Vacancy.JobApplication.Commands.CreateJobApplication;

public record CreateJobApplicationResponse
(
    bool UseProfileCv,
    string? NewCv,
    string? PresentationLetter,
    decimal? SalaryPretention,
    StartAvailability? StartAvailability,
    bool ShareCv,
    DateTime AppliedDate,
    string AppUserId,
    int VacancyId
);
