namespace Application.Empregangola.Features.UserDetails.Queries.GetUserDetails;

public class UserDetailsDto
{
    public string AppUserId { get; set; }
    public string UserName { get; set; }
    public string FullName { get; set; }    
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string Address { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    public string Location { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string PhotoProfile { get; set; }
    public int Genero { get; set; }
    public string SobreMim {  get; set; }
}
