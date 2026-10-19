using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("CompanyInterest")]
public class CompanyInterestTable
{
    [Key]
    public Guid CompanyInterestId { get; set; }

    public string AppUserId { get; set; }

    [ForeignKey("AppUserId")]
    public virtual AppUser AppUser { get; set; }

    public Guid CompanyId { get; set; }

    [ForeignKey("CompanyId")]
    public virtual CompanyTable Company { get; set; }

    public int InterestId { get; set; }

    [ForeignKey("InterestId")]
    public virtual InterestTable Interest { get; set; }
}
