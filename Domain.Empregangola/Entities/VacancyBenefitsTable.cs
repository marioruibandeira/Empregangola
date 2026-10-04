using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("VacancyBenefits")]
public class VacancyBenefitsTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int VacancyBenefitsId { get; set; }

    public int VacancyId { get; set; }
    [ForeignKey("VacancyId")]
    public VacanciesTable Vacancy { get; set; }

    [Required, MaxLength(80)]
    public string Benefit { get; set; }
}