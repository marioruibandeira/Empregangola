using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("VagaDestaque")]
public class FeaturedVacanciesTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int FeaturedVacancyId { get; set; }

    public int VacancyId { get; set; }
    [ForeignKey(nameof(VacancyId))]
    public VacanciesTable Vacancy {  get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public bool Paused { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? RemovedOn { get; set; }
}
