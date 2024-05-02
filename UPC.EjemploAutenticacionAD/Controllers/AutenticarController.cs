using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Buffers;
using System.Security.Claims;
using UPC.EjemploAutenticacionAD.IdUsuario.Interfaces;
using UPC.EjemploAutenticacionAD.Models;

namespace UPC.EjemploAutenticacionAD.Controllers;

public class AutenticarController : Controller
{
    private readonly IAutenticacionADService _autenticacionADService;

    public AutenticarController(IAutenticacionADService autenticacionADService)
    {
        _autenticacionADService = autenticacionADService;
    }

    public IActionResult Login(string? url = null)
    {
        AutenticarModel.LoginVM model = new();
        ViewBag.Url = url;
        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(AutenticarModel.LoginVM model, string? url = null)
    {
        Validar(model);
        if (!ModelState.IsValid) return View(model);

        var consulta = model.ToAutenticacionADConsulta();
        var respuesta = await _autenticacionADService.AutenticarAsync(consulta);

        if (respuesta.Detalle.AutenticaUsuarios.Codigo != 0)
        {
            model.Mensaje = respuesta.Detalle.AutenticaUsuarios.Observacion;
            return View(model);
        }

        Claim[] claims = new Claim[] { new(ClaimTypes.Name, model.Usuario) };
        var userIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        AuthenticationProperties propiedades = new()
        {
            IsPersistent = true,
            AllowRefresh = true,
        };
        var principal = new ClaimsPrincipal(userIdentity);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, propiedades);

        return Redirect(url ?? "/");
    }

    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Login");
    }

    #region Metodos

    [NonAction]
    private void Validar(AutenticarModel.LoginVM entidad)
    {
        ModelState.Clear();
        if (string.IsNullOrEmpty(entidad.Usuario)) ModelState.AddModelError("Usuario", "Es necesario ingresar el usuario.");
        if (string.IsNullOrEmpty(entidad.Clave)) ModelState.AddModelError("Clave", "Es necesario la clave.");
    }
    #endregion
}
