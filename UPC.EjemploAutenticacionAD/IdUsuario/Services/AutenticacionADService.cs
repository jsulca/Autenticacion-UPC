using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using UPC.EjemploAutenticacionAD.IdUsuario.Dtos;
using UPC.EjemploAutenticacionAD.IdUsuario.Interfaces;

namespace UPC.EjemploAutenticacionAD.IdUsuario.Services;

public class AutenticacionADService : IAutenticacionADService
{
    private readonly string _urlIdUsuario;
    private readonly string _usuario;
    private readonly string _clave;

    private readonly string _endPointAutenticar;

    public AutenticacionADService(IConfiguration configuration)
    {
        _urlIdUsuario = configuration["ServiciosIdUsuario:Url"] ?? throw new("No se inicializó la url del servicio ID USUARIO");
        _usuario = configuration["ServiciosIdUsuario:User"] ?? throw new("No se inicializó el usuario del servicio ID USUARIO");
        _clave = configuration["ServiciosIdUsuario:Password"] ?? throw new("No se inicializó la clave del servicio ID USUARIO");
        _endPointAutenticar = configuration["ServiciosIdUsuario:AutenticarEndPoint"] ?? throw new("No se inicializó el end point del servicio Autenticar -> ID USUARIO");
    }

    public async Task<DTOAutenticacionAD> AutenticarAsync(DTOAutenticacionADConsulta consulta)
    {
        DTOAutenticacionAD respuesta = new();

        try
        {
            using var http = new HttpClient();
            string autenticacionBasica = Convert.ToBase64String(Encoding.ASCII.GetBytes(string.Format("{0}:{1}", _usuario, _clave)));
            http.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));//ACCEPT header
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", autenticacionBasica);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(string.Concat(_urlIdUsuario, _endPointAutenticar)),
                Content = new StringContent(JsonSerializer.Serialize(consulta), Encoding.UTF8, "application/json")
            };

            HttpResponseMessage response = await http.SendAsync(request);

            string data = await response.Content.ReadAsStringAsync();
            var opciones = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            respuesta = JsonSerializer.Deserialize<DTOAutenticacionAD>(data, opciones) ?? new();
        }
        catch (Exception)
        {
            respuesta.Detalle = new(new(9999, "No se pudo conectar con el servicio de autenticación."));
        }

        return respuesta;
    }
}
