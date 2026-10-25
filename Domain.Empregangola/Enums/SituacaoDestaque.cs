using System.ComponentModel.DataAnnotations;

namespace Domain.Empregangola.Enums;

public enum SituacaoDestaque
{
    [Display(Name = "Activa")]
    Activa = 1,
    [Display(Name = "A Terminar")]
    ATerminar = 2,
    [Display(Name = "Pausada")]
    Pausada = 3,
    [Display(Name = "Terminada")]
    Terminada = 4
}
