using Microsoft.AspNetCore.Identity;

namespace Domain.Empregangola.Entities
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public int TipoUtilizador { get; private set; } 


        public static AppUser Create(string fullName, string email, int tipoUtilizador)
        {
            if (string.IsNullOrWhiteSpace(fullName))
                throw new ArgumentException("FullName é obrigatório.", nameof(fullName));

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email é obrigatório.", nameof(email));

            if(!email.Contains("@"))
                throw new ArgumentException("Email inválido.", nameof(email));

            return new AppUser
            {
                FullName = fullName.Trim(),
                UserName = email,
                Email = email,
                TipoUtilizador = tipoUtilizador,
                EmailConfirmed = false
            };
        }

        // Construtor privado para forçar uso da factory
        private AppUser() { }

        //public Guid Id { get; set; } 
        //public string Name { get; set; }
        //public string Email { get; set; }
        //public string PasswordHash { get; set; }
        //public string Role { get; set; } = "Student"; // Default role

        //public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
