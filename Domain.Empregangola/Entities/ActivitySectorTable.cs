using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("ActivitySector")]
public class ActivitySectorTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ActivitySectorId { get; set; }
    public string ActivitySector { get; set; }
}
