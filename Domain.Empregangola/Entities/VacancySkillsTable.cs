using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("VacancySkills")]
public class VacancySkillsTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int VacancySkillsId { get; set; }

    public int VacancyId { get; set; }
    [ForeignKey("VacancyId")]
    public VacanciesTable Vacancy { get; set; }

    [Required, MaxLength(50)]
    public string Skill { get; set; }
}