using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("PremiumVacancies")]
public class PremiumVacanciesTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PremiumVacancyId { get; set; }

    public int VacancyId { get; set; }
    public VacanciesTable Vacancy { get; set; }

    public int PremiumSubscriptionId { get; set; }
    public PremiumSubscriptionTable PremiumSubscription { get; set; }
}
