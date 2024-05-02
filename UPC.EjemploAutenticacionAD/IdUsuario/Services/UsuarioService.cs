using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using UPC.EjemploAutenticacionAD.IdUsuario.Dtos;
using UPC.EjemploAutenticacionAD.IdUsuario.Interfaces;

namespace UPC.EjemploAutenticacionAD.IdUsuario.Services;

public class UsuarioService : IUsuarioService
{
    private readonly string _urlIdUsuario;
    private readonly string _usuario;
    private readonly string _clave;

    private readonly string _endPointUsuario;


    public UsuarioService(IConfiguration configuration)
    {
        _urlIdUsuario = configuration["ServiciosIdUsuario:Url"] ?? throw new("No se inicializó la url del servicio ID USUARIO");
        _usuario = configuration["ServiciosIdUsuario:User"] ?? throw new("No se inicializó el usuario del servicio ID USUARIO");
        _clave = configuration["ServiciosIdUsuario:Password"] ?? throw new("No se inicializó la clave del servicio ID USUARIO");

        _endPointUsuario = configuration["ServiciosIdUsuario:UsuarioEndPoint"] ?? throw new("No se inicializó el end point del servicio Usuario -> ID USUARIO");
    }

    public async Task<DTOUsuarioRespuesta> BuscarAsync(DTOUsuarioConsulta consulta)
    {
        DTOUsuarioRespuesta? respuesta = new();
        try
        {
            List<string> parametros = new();

            if (!string.IsNullOrEmpty(consulta.CodigoNivel)) parametros.Add($"NIVEL={consulta.CodigoNivel}");
            if (!string.IsNullOrEmpty(consulta.CodigoUsuario)) parametros.Add($"COD_USUARIO={consulta.CodigoUsuario}");

            string url = $"{_urlIdUsuario}{_endPointUsuario}?{string.Join("&", parametros)}";

            using var http = new HttpClient();
            string autenticacionBasica = Convert.ToBase64String(Encoding.ASCII.GetBytes(string.Format("{0}:{1}", _usuario, _clave)));
            http.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", autenticacionBasica);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(url),
                Content = new StringContent(JsonSerializer.Serialize(consulta), Encoding.UTF8, "application/json")
            };

            HttpResponseMessage response = await http.SendAsync(request);

            string data = await response.Content.ReadAsStringAsync();
            respuesta = JsonSerializer.Deserialize<DTOUsuarioRespuesta>(data) ?? new();
        }
        catch (Exception)
        {
            respuesta.ListaDTOAlumnoAuth = new();
        }

        return respuesta!;
    }

}
