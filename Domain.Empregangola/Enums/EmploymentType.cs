using System.ComponentModel.DataAnnotations;

namespace Domain.Empregangola.Enums;

public enum EmploymentType
{
    [Display(Name = "Efectivo")]
    Permanent = 1,
    [Display(Name = "Prazo certo")]
    FixedTerm = 2,
    [Display(Name = "Estágio")]
    Internship = 3,
    [Display(Name = "Freelance")]
    Freelance = 4,
}
