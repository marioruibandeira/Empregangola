using System.ComponentModel.DataAnnotations;

namespace Domain.Empregangola.Enums;

public enum MinimumExperience
{
    [Display(Name = "Sem experiência")]
    None = 0,

    [Display(Name = "1 ano")]
    OneYear = 1,

    [Display(Name = "2 a 3 anos")]
    TwoToThreeYears = 2,

    [Display(Name = "4 a 5 anos")]
    FourToFiveYears = 3,

    [Display(Name = "Mais de 5 anos")]
    MoreThanFiveYears = 4
}
