using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Domain.Empregangola.Entities;

[Table("PaisTable")]
public class PaisTable
{
    [Key]       
    public Guid PaidId { get; set; }
    public string Pais { get; set; }
    public string Sigla { get; set; }
}
