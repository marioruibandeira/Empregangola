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
    public string Names { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;
    public int Telefone { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public AppUser AppUser { get; set; } = null!;
}