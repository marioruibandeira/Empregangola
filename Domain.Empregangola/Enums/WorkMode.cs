using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace Domain.Empregangola.Enums;

public enum WorkMode
{

    [Display(Name = "Presencial")]
    OnSite = 1,
    [Display(Name = "Híbrido")]
    Hybrid = 2,
    [Display(Name = "Remoto")]
    Remote = 3,
}
