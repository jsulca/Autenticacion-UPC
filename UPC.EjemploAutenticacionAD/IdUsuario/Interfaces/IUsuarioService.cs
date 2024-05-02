using UPC.EjemploAutenticacionAD.IdUsuario.Dtos;

namespace UPC.EjemploAutenticacionAD.IdUsuario.Interfaces;

public interface IUsuarioService
{
    Task<DTOUsuarioRespuesta> BuscarAsync(DTOUsuarioConsulta consulta);
}
