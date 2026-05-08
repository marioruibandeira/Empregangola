namespace Application.Empregangola.DTOs.Responses;

public class UserDetailsResponse
{
    public Guid Id { get; set; }
    public string Names { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Telefone { get; set; }
}