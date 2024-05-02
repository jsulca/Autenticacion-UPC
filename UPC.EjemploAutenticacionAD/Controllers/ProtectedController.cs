using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UPC.EjemploAutenticacionAD.Controllers;

[Authorize]
public abstract class ProtectedController : Controller
{
}
