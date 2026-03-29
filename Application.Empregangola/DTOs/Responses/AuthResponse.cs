using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Empregangola.DTOs.Responses
{
    public record AuthResponse(string Token, string Email, string FullName);
}
