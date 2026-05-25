using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Empregangola.Entities;

[Table("UserDetails")]
public class UserDetailsTable
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string AppUserId { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    public string Address { get; set; } = string.Empty;

    [Required]
    public string PostalCode { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string PhotoProfile {  get; set; } = string.Empty;
    public int Genero { get; set; } = 2;

    [Column(TypeName = "nvarchar(500)")]
    public string SobreMim {  get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public AppUser AppUser { get; set; } = null!;

}