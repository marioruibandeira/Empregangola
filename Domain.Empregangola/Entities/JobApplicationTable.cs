using Domain.Empregangola.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("JobApplication")]
public class JobApplicationTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int JobApplicationId { get; set; }

    public bool UseProfileCv { get; set; }

    public string? NewCv { get; set; }

    public string? PresentationLetter { get; set; }

    public decimal? SalaryPretention { get; set; }

    public StartAvailability? StartAvailability { get; set; }

    public bool ShareCv { get; set; }

    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

    public string AppUserId { get; set; } = string.Empty;
    [ForeignKey("AppUserId")]
    public AppUser AppUser { get; set; } = null!;

    public int VacancyId { get; set; }
    [ForeignKey("VacancyId")]
    public VacanciesTable Vacancy { get; set; } = null!;
}
