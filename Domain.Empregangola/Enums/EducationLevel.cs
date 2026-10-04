using System.ComponentModel.DataAnnotations;

namespace Domain.Empregangola.Enums;

public enum EducationLevel
{
    [Display(Name = "7º / 8º Classe")]
    SeventhOrEighthGrade = 1,

    [Display(Name = "9º / 10º Classe")]
    NinthOrTenthGrade = 2,

    [Display(Name = "11º / 13º Classe")]
    EleventhToThirteenthGrade = 3,

    [Display(Name = "Médio")]
    SecondaryEducation = 4,

    [Display(Name = "Bacharel")]
    Bachelor = 5,

    [Display(Name = "Licenciatura ou equivalente")]
    Degree = 6,

    [Display(Name = "Mestrado")]
    Master = 7,

    [Display(Name = "Doutoramento")]
    Doctorate = 8
}
