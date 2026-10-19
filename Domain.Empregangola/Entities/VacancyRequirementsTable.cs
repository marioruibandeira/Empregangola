using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("VacancyRequirements")]
public class VacancyRequirementsTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int VacancyRequirementsId { get; set; }

    public int VacancyId { get; set; }
    [ForeignKey("VacancyId")]
    public VacanciesTable Vacancy { get; set; }

    [Required, MaxLength(300)]
    public string Description { get; set; }

    [Required]
    public int Order { get; set; }
}