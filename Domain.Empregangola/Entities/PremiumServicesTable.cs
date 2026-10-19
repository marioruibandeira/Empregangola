using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("PremiumServices")]
public class PremiumServicesTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PremiumServiceId { get; set; }

    public string ServiceName { get; set; }

    public string Description { get; set; }

    public decimal Price { get; set; }

    public int DurationInDays { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
