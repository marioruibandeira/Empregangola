using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

public class PremiumSubscriptionTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PremiumSubscriptionId { get; set; }

    public int PremiumServiceId { get; set; }
    public PremiumServicesTable PremiumService { get; set; }

    public string AppUserId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; }
}
