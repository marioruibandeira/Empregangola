using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Empregangola.DTOs.Requests
{
    public record RegisterRequest(string FullName, string Email, string Password, int tipoUtilizador);
}
