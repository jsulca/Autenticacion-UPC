using UPC.EjemploAutenticacionAD.IdUsuario.Interfaces;
using UPC.EjemploAutenticacionAD.IdUsuario.Services;

namespace UPC.EjemploAutenticacionAD.IdUsuario;

public static class DependencyInjection
{
    public static IServiceCollection AddIdUsuario(this IServiceCollection services)
    {
        services.AddScoped<IAutenticacionADService, AutenticacionADService>()
            .AddScoped<IUsuarioService, UsuarioService>();
        return services;
    }
}
