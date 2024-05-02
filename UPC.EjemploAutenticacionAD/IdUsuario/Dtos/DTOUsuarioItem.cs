namespace UPC.EjemploAutenticacionAD.IdUsuario.Dtos;

public class DTOUsuarioItem
{
    public string NIVEL { get; set; } = string.Empty;
    public string LOGIN { get; set; } = string.Empty;
    public string APELLIDO_PATERNO { get; set; } = string.Empty;
    public string APELLIDO_MATERNO { get; set; } = string.Empty;
    public string NOMBRES { get; set; } = string.Empty;
    public int TIPO_DOCUMENTO { get; set; }
    public string DOCU_IDENTIDAD { get; set; } = string.Empty;
    public int COD_TIPO_USUARIO { get; set; }
    public string DESCRIPCION_TIPO_USUARIO { get; set; } = string.Empty;
}
