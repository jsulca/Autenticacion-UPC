using UPC.EjemploAutenticacionAD.IdUsuario.Dtos;

namespace UPC.EjemploAutenticacionAD.IdUsuario.Interfaces;

public interface IAutenticacionADService
{
    Task<DTOAutenticacionAD> AutenticarAsync(DTOAutenticacionADConsulta consulta);
}
