using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Domain.Empregangola.Entities;

[Table("Country")]
public class CountryTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int CountryId { get; set; }
    public string Country { get; set; }
    public string Acronym { get; set; }
}
