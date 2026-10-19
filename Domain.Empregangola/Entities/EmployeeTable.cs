using Domain.Empregangola.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("Employee")]
public class EmployeeTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int EmployeeId { get; set; }

    public string AppUserId { get; set; } = string.Empty;

    [ForeignKey(nameof(AppUserId))]
    public AppUser AppUser { get; set; } = null!;

    public string? FullName { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }

    public Gender? Gender { get; set; } 

    public MaritalStatus? MaritalStatus { get; set; }
    
    public int? NationalityId { get; set; } 
    [ForeignKey(nameof(NationalityId))]
    public CountryTable? NationalityCountry { get; set; } = null!;

    public string? PlaceOfBirth { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}
