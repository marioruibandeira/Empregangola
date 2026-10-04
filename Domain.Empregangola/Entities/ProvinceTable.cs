using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("Province")]
public class ProvinceTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProvinceId { get; set; }

    [Required, MaxLength(50)]
    public string Name { get; set; }
}
