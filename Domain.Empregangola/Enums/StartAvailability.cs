using System.ComponentModel.DataAnnotations;

namespace Domain.Empregangola.Enums;

public enum StartAvailability
{
    [Display(Name = "Idediata")]
    Immediate = 1,

    [Display(Name = "15 dias")]
    FifteenDays = 2,

    [Display(Name = "30 dias")]
    ThirtyDays = 3,

    [Display(Name = "60 dias ou mais")]
    SixtyDaysOrMore = 4
}
