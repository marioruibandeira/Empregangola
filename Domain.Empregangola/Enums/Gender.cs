using System.ComponentModel.DataAnnotations;

namespace Domain.Empregangola.Enums;

public enum Gender
{
    [Display(Name = "Masculino")]
    Masculino = 1,
    [Display(Name = "Feminino")]
    Feminino = 2,
    [Display(Name = "Outros")]
    Outros = 3
}
