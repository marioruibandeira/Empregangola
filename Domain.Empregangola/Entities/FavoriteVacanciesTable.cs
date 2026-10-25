using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("FavoriteVacancies")]
public class FavoriteVacanciesTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int FavoriteVacancyId { get; set; }

    public int VacancyId { get; set; }
    [ForeignKey("VacancyId")]
    public VacanciesTable Vacancy {  get; set; }

    public string AppUserId { get; set; }
    [ForeignKey("AppUserId")]
    public AppUser AppUser { get; set; }

    public DateTime DateCreated {  get; set; }
}
