using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("Company")]
public class CompanyTable
{
    [Key]
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; }
    public string TaxNumber { get; set; }

    public int ActivitySectorId { get; set; }

    [ForeignKey("ActivitySectorId")]
    public virtual ActivitySectorTable ActivitySector { get; set; }

    public int EmployeeCountId { get; set; }

    [ForeignKey("EmployeeCountId")]
    public virtual EmployeeCountTable EmployeeCount { get; set; }

    public int CountryId { get; set; }

    [ForeignKey("CountryId")]
    public virtual CountryTable Country { get; set; }

    public string Provincy { get; set; }
    public string Municipality { get; set; }
    public string PersonResponsible { get; set; }

    public string Position {get; set;}

    public string CorporateEmail { get; set; }
    public string Phone { get; set; }

    public string AboutCompany { get; set; }

    public string AppUserId { get; set; }

    [ForeignKey("AppUserId")]
    public virtual AppUser AppUser { get; set; } = null!;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
