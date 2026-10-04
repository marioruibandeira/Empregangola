using Application.Empregangola.DTOs.Responses;
using Domain.Empregangola.Entities;
using MediatR;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.Empregangola.Features.CompanyDetails.Commands.UpdateCompanyDetails;

public record UpdateCompanyDetailsCommand(
        string Id,
        string CompanyName,
        string TaxNumber ,
        int ActivitySectorId ,
        int EmployeeCountId ,
        int CountryId ,
        string Provincy ,
        string Municipality ,
        string PersonResponsible ,
        string Position,
        string CorporateEmail ,
        string Phone ,
        string AboutCompany ,
        string AppUserId 
    ) : IRequest<UpdateCompanyDetailsResponse>;
