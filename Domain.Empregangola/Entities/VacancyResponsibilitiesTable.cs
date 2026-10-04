using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("VagaResponsabilidades")]
public class VacancyResponsibilitiesTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int VacancyResponsibilitiesId { get; set; }

    public int VacanciesId { get; set; }
    [ForeignKey("VacanciesId")]
    public VacanciesTable Vacancy { get; set; }

    [Required, MaxLength(300)]
    public string Description { get; set; }

    [Required]
    public int Order { get; set; }
}
