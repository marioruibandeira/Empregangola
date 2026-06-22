namespace Application.Empregangola.Features.CompanyDetails.Queries.GetCompanyDetails;

public class CompanyDetailsDto
{
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; }
    public string TaxNumber { get; set; }
    public int ActivitySectorId { get; set; }
    public int EmployeeCountId { get; set; }
    public int CountryId { get; set; }
    public string Provincy { get; set; }
    public string Municipality { get; set; }
    public string PersonResponsible { get; set; }
    public string Position { get; set; }
    public string CorporateEmail { get; set; }
    public string Phone { get; set; }
    public string AboutCompany { get; set; }
    public string AppUserId { get; set; }

    public List<int> InterestIds { get; set; }
}
