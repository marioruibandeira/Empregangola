using Domain.Empregangola.Entities;
using Domain.Empregangola.Enums;
using Domain.Empregangola.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Empregangola.Features.Vacancy.JobApplication.Commands.CreateJobApplication;

public class CreateJobApplicationHandler : IRequestHandler<CreateJobApplicationCommand, CreateJobApplicationResponse>
{
    private readonly IJobApplicationRepository _applicationRepo;
    private readonly UserManager<AppUser> _userManager;
    public CreateJobApplicationHandler(IJobApplicationRepository applicationRepo, UserManager<AppUser> userManager) 
    {
        _applicationRepo = applicationRepo;
        _userManager = userManager;
    }

    public async Task<CreateJobApplicationResponse> Handle(CreateJobApplicationCommand command, CancellationToken cancellationToken)
    {
        var existAppl = await _applicationRepo.ExistsAsync(command.VacancyId, cancellationToken);

        if (existAppl)
        {
            throw new InvalidOperationException($"Já se candidatou para esta vaga.");
        }

        var application = new JobApplicationTable
        {
            UseProfileCv = command.UseProfileCv,
            NewCv = command.NewCv,
            PresentationLetter = command.PresentationLetter,
            SalaryPretention = command.SalaryPretention,
            StartAvailability = command.StartAvailability,
            ShareCv = command.ShareCv,
            AppliedDate = command.AppliedDate,
            AppUserId = command.AppUserId,
            VacancyId = command.VacancyId
        };

        var result = await _applicationRepo.CreateAsync(application, cancellationToken);

        return new CreateJobApplicationResponse(
                UseProfileCv: result.UseProfileCv,
                NewCv : result.NewCv,
                PresentationLetter : result.PresentationLetter,
                SalaryPretention : result.SalaryPretention,
                StartAvailability : result.StartAvailability,
                ShareCv: result.ShareCv,
                AppliedDate: result.AppliedDate,
                AppUserId: result.AppUserId,
                VacancyId: result.VacancyId
            );
    }
}
