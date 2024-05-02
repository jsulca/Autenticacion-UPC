using UPC.EjemploAutenticacionAD.IdUsuario.Dtos;

namespace UPC.EjemploAutenticacionAD.Models;

public struct AutenticarModel
{
    public class LoginVM
    {
        public string Usuario { get; set; } = string.Empty;
        public string Clave { get; set; } = string.Empty;
        public string? Mensaje { get; set; }

        public DTOAutenticacionADConsulta ToAutenticacionADConsulta() => new(Usuario, Clave);
        public DTOUsuarioConsulta ToUsuarioConsulta() => new("UG", Usuario);
    }
}
