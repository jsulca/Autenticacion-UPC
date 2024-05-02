//**********************************************************************
// Nombre: ready
// Funcion: Evento de Carga
//**********************************************************************
$(function () {
    if (!window.c_url_servidor) {
        window.c_url_servidor = $('#hdnUrlServidor').val();
    }
});

//**********************************************************************
// Nombre: $.fn.uf_ajaxRequest
// Funcion: Realiza una petición ajax al servidor
//**********************************************************************
$.fn.uf_ajaxRequest = function (opts) {
    try {
        if (opts['conLoading']) {
            try {
                $.fn.uf_showAjaxLoading();
            } catch (e) {
                window.console.log('Error al mostrar el loading ' + e.message);
            }
        }

        var ajax = {
            type: opts['type'] != null ? opts['type'] : 'GET',      // GET, POST, PUT O DELETE (verbo HTTP), si se omite, por defecto es GET
            async: opts['async'] != null ? opts['async'] : true,    // true o false, llamada sícrona o asíncrona, por defecto la llamada es asíncrona (true)
            timeout: opts['timeout'] != null ? opts['timeout'] : 0, // Tiempo máximo de espera para la petición (en milisegundos), si sobrepasa se considera fallida. Por defecto es ilimitada (0)
            url: opts['url'],   // ubicación del servicio
            data: opts['data'] != null ? opts['data'] : {},         // data enviada al servidor
            dataType: opts['dataType'] != null ? opts['dataType'] : 'json', // Tipo de dato que se espera que se devuelva en la respuesta
            contentType: opts['contentType'] != null ? opts['contentType'] :
                                     'application/json; charset=UTF-8',   // Tipo de contenido que se especifica en la petición.
            success: opts['success'] != null ? opts['success'] : null,   // función callback si la llamada al server fue exitosa
            error: opts['error'] != null ? opts['error'] : null,       // función callback si la llamada al server falló
            cache: opts['cache'] != null ? opts['cache'] : false,    // Indica si la petición debe quedar en la cache del navegador
            processData: opts['processData'] != null ? opts['processData'] : true,
            complete: opts['complete'] != null ? opts['complete'] : null   // función callback si la llamada al server fue exitosa
        };

        if (opts['headers'])
            ajax['headers'] = opts['headers'];

        var ajaxRequest = jQuery.ajax(ajax);

        return ajaxRequest;
    } catch (e) {
        $.fn.uf_stopAjaxLoading();
        alert("Ha ocurrido un error Javascript en la petición Ajax: " + e.message);
    }
};


//**********************************************************************
// Nombre: $.fn.uf_showAjaxLoading
// Funcion: Función que se dispara después de la petición ajax
//**********************************************************************
$.fn.uf_ajaxDone = function () {
    
};


//**********************************************************************
// Nombre: $.fn.uf_showAjaxLoading
// Funcion: Muestra el loading en una petición ajax
//**********************************************************************
$.fn.uf_showAjaxLoading = function () {
    var preload = $("#preload");

    if (preload.length > 0)
        preload.remove();

    $('<div id="preload" class=""></div>').prependTo("body");
    $('<div id="status"></div>').prependTo("#preload");
    $('<div id="statustext">Espere por favor...</div>').prependTo("#status");
    $("#preload").addClass('on');
};


//**********************************************************************
// Nombre: $.fn.uf_stopAjaxLoading
// Funcion: Apaga el indicador de loading
//**********************************************************************
$.fn.uf_stopAjaxLoading = function () {
    var preload = $("#preload");

    if (preload.length > 0)
        preload.remove();
};


//**********************************************************************
// Nombre: $.fn.uf_configureOthersValidators
// Funcion: Configura otros validators para el jQuery validate
//**********************************************************************
$.fn.uf_configureOthersValidators = function () {
    $.validator.methods.number = function (value, e) {
        return this.optional(e) || /^\d+\.?\d{0,2}$/.test(value)
    };

    $.validator.addMethod("comparaAnioSilabo", function (value, element) {
        var resultado = false;
        var anioSilabo = value;
        var anioCertificado = $('#txtAnioCertificado').val();

        resultado = value == anioCertificado;

        return resultado;
    }, "Año del sílabo debe coincidir con año del certificado");

    $.validator.addMethod("comparaAnioCertificado", function (value, element) {
        var resultado = false;
        var anioCertificado = value;
        var anioSilabo = $('#txtAnioSilabo').val();

        resultado = value == anioSilabo;

        return resultado;
    }, "Año del certificado debe coincidir con año del sílabo");

    $.validator.addMethod("comparaAnioActual", function (value, element) {
        var resultado = false;
        var anioActual = $('#hdnAnioActual').val();

        resultado = value <= anioActual;

        return resultado;
    }, "Año no puede ser mayor que el actual");

    //AKN - 09-08-2018 - se agrega validacion para espacio 
    $.validator.addMethod("noSpace", function (value, element) {
        return value == '' || value.trim().length != 0;
    }, "No se permiten espacios");

};


//**********************************************************************
// Nombre: $.fn.uf_rotarElemento
// Funcion: Función que rota un elemento 180 grados
//**********************************************************************
$.fn.uf_rotarElemento = function (elemento) {
    var angulo = $.fn.uf_getRotationDegrees(elemento) == 0 ? 180 : 0;

    elemento.css({
        '-webkit-transform': 'rotate(' + angulo + 'deg)',
        '-ms-transform': 'rotate(' + angulo + 'deg)',
        '-o-transform': 'rotate(' + angulo + 'deg)',
        'transform': 'rotate(' + angulo + 'deg)'
    });
};


//**********************************************************************
// Nombre: $.fn.uf_getRotationDegrees
// Funcion: Devuelve el ángulo de rotación del objeto a 180 grados
//**********************************************************************
$.fn.uf_getRotationDegrees = function (obj) {
    var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");

    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else { var angle = 0; }

    if (angle < 0) angle += 360;

    return angle;
};


//**********************************************************************
// Nombre: $.fn.uf_alertDelay
// Funcion: Muestra un alert con delay
//**********************************************************************
$.fn.uf_alertDelay = function (container, type, message, fCallbak) {
    container.append($("<div class='alert-message alert alert-" + type + " fade in' data-alert><p> " + message + " </p></div>"));

    $(".alert-message").delay(1000).fadeOut(2000, function () {
        $(this).remove();
        if (fCallbak != null)
            fCallbak();
    });
};


//**********************************************************************
// Nombre: $.fn.uf_cargarDropDownList
// Funcion: Carga un dropwdownList
//**********************************************************************
$.fn.uf_cargarDropDownList = function (params) {
    var combo = params['Dropdown'];
    var lista = params['Lista'];
    var conSeleccione = params['ConSeleccione'];

    var elements = '';
    
    if (conSeleccione)
        elements += "<option value='---Seleccione-'>" + item.Text + "</option>";

    $.each(lista, function (i, item) {
        elements += "<option value='" + item.Value + "'>" + item.Text + "</option>";
    });
    combo.html('');
    combo.html(elements);
    combo[0].sumo.reload();
};


//**********************************************************************
// Nombre: $.fn.uf_limpiarDropDownList
// Funcion: Limpia un dropwdownList
//**********************************************************************
$.fn.uf_limpiarDropDownList = function (params) {
    var combo = params['Combo'];
    var conSeleccione = params['ConSeleccione'];
    var desabilitar = params['Desabilitar'];

    combo.html('');

    if (conSeleccione) {
        combo.html('<option value="">' + (params['Seleccione'] != null ? params['Seleccione'] : '(Seleccione)') + '</option>')
    }

    combo[0].sumo.reload();

    if (desabilitar)
        combo[0].sumo.disable();
};


//**********************************************************************
// Nombre: $.fn.uf_validarSumoSelect
// Funcion: Valida un sumoSelect
//**********************************************************************
$.fn.uf_validarSumoSelect = function (params) {
    var result = false;
    var comboId = params['ComboId'];
    var campo = params['Campo'];
    var data_val = params['DataVal'];
    var valInvalid = params['ValInvalid'];

    var elementSelected = '.SumoSelect.sumo_' + campo + ' .CaptionCont';
    var textSelected = $.trim($(elementSelected).attr('title'));

    var options = $('#' + comboId + ' option');

    var valueSelected = null;
    for (var i = 0; i < options.length; ++i) {
        var optionText = $.trim($(options[i]).text());

        if (optionText == textSelected) {
            valueSelected = $(options[i]).attr('value');
            break;
        }
    }

    if (valueSelected == valInvalid) {
        var errorMessage = $('#' + comboId).attr(data_val);
        $('span[data-valmsg-for=' + campo + ']').text(errorMessage);
    }
    else {
        $('span[data-valmsg-for=' + campo + ']').text('');
        result = true;
    }

    return result;
}


//**********************************************************************
// Nombre: $.fn.uf_showError
// Funcion: Mestra el mensaje de error capturado vía Javascript
//**********************************************************************
$.fn.uf_showError = function (e) {
    $.fn.uf_hideOrShowErrorMessage(e.toString());
}


//**********************************************************************
// Nombre: $.fn.uf_showErrorRequest
// Funcion: Mestra el mensaje de error al realizar una petición
//**********************************************************************
$.fn.uf_showErrorRequest = function () {
    $.fn.uf_hideOrShowErrorMessage('Ocurrió un error al realizar la petición');
}


//**********************************************************************
// Nombre: $.fn.uf_hideOrShowAlertMessage
// Funcion: Oculta o muestra un mensaje 
//**********************************************************************
$.fn.uf_hideOrShowErrorMessage = function (message) {
    $.fn.uf_hideOrShowAlertMessage({ Accion: 'show', TipoMensaje: 'E', Mensaje: message });
}


//**********************************************************************
// Nombre: $.fn.uf_hideOrShowAlertMessage
// Funcion: Oculta o muestra un mensaje 
//**********************************************************************
$.fn.uf_hideOrShowAlertMessage = function (param) {
    var accion = param['Accion'];
    $('#lblMensajes').html('');
    if (accion == 'hide') {
        $('#lblMensajeError').html('');
        $('#contenedorError').css('display', 'none');
    }
    else {
        var tipoMensaje = param['TipoMensaje'];
        var clase = tipoMensaje == 'E' ? 'danger' : (tipoMensaje == 'I' ? 'info' : (tipoMensaje == 'S' ? 'success' : 'warning'));
        var mensaje = param['Mensaje'];
        var moverScrollTop = param['MoverScrollTop'];

        $('#panelMensajes').addClass('alert-' + clase);

        $('#lblMensajeError').html(mensaje);
        $('#contenedorError').css('display', 'block');

        if (moverScrollTop)
            $(window).scrollTop(0);
    }
};

//**********************************************************************
// Nombre: $.fn.uf_hideOrShowErrorMessageMultiple
// Funcion: Oculta o muestra un mensaje 
//**********************************************************************
$.fn.uf_hideOrShowErrorMessageMultiple = function (message) {
    $.fn.uf_hideOrShowAlertMessageMultiple({ Accion: 'show', TipoMensaje: 'E', Mensaje: message });
}

//**********************************************************************
// Nombre: $.fn.uf_hideOrShowAlertMessage
// Funcion: Oculta o muestra un mensaje 
//**********************************************************************
$.fn.uf_hideOrShowAlertMessageMultiple = function (param) {
    var accion = param['Accion'];
    
    if (accion == 'hide') {
        $('#lblMensajeError').html('');        
        $('#contenedorError').css('display', 'none');
        $('#lblMensajes').html('');
    }
    else {
        var tipoMensaje = param['TipoMensaje'];
        var clase = tipoMensaje == 'E' ? 'danger' : (tipoMensaje == 'I' ? 'info' : (tipoMensaje == 'S' ? 'success' : 'warning'));
        var mensaje = param['Mensaje'];
        var moverScrollTop = param['MoverScrollTop'];

        $('#panelMensajes').addClass('alert-' + clase);

        if (mensaje.Principal != undefined)
        {
            $('#lblMensajeError').html(mensaje.Principal);

            var texto="";
            for (i = 0; i < mensaje.Secundario.length; i++)
            {
                texto += '<span class="block text-helvetica-16 list-circle">';
                texto += '<i class="iconupc iconupc-list-circle-danger"></i>' +mensaje.Secundario[i].Mensaje;
                texto += '</span>';
            }
            $('#lblMensajes').html(texto);

        } else {
            $('#lblMensajeError').html(mensaje);
            $('#lblMensajes').html('');
        }              

        $('#contenedorError').css('display', 'block');

        if (moverScrollTop)
            $(window).scrollTop(0);
    }
};

//**********************************************************************
// Nombre: $.fn.uf_solo_alfanumerico
// Funcion: Valida solo caracteres alfanuméricos
//**********************************************************************
$.fn.uf_solo_alfanumerico = function (e) {
    var regex = /^[a-zA-Z0-9\b]+$/;
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        e.preventDefault();
        return false;
    }
};

//**********************************************************************
// Nombre: $.fn.uf_validar_plantilla
// Funcion: Valida la existencia de la plantilla del trámite
//**********************************************************************
$.fn.uf_validar_plantilla = function (orden, tipoSolicitudModalidadId, mensaje, callbackError) {
    $.ajax({
        url: '/Archivo/ValidarExistenciaPlantilla',
        type: 'POST',
        data: { orden: orden, tipoSolicitudModalidadId: tipoSolicitudModalidadId },
        success: function (data) {
            if (data.CodigoResultado) {
                location.href = "/Archivo/DescargarPlantilla?orden=" + orden + "&tipoSolicitudModalidadId=" + tipoSolicitudModalidadId;
            } else {
                if (callbackError !== undefined) {
                    callbackError(mensaje);
                }
            }
        },
        error: function (xhr, status, error) {
            if (callbackError !== undefined) {
                callbackError(idSolicitud, mensaje);
            }
        }
    });
};

//**********************************************************************
// Nombre: $.fn.uf_validar_documento
// Funcion: Valida la existencia de la plantilla del trámite
//**********************************************************************
$.fn.uf_validar_documento = function (idDocumentoSustento, idSolicitud, mensaje, callbackError) {
    $.ajax({
        url: '/Archivo/ValidarExistenciaDocumento',
        type: 'POST',
        data: { idDocumentoSustento: idDocumentoSustento },
        success: function (data) {
            if (data.CodigoResultado) {
                location.href = "/Archivo/DescargarDocumentoSustento?idDocumentoSustento=" + idDocumentoSustento;
            } else {
                if (callbackError !== undefined) {
                    callbackError(idSolicitud, mensaje);
                }
            }
        },
        error: function (xhr, status, error) {
            if (callbackError !== undefined) {
                callbackError(idSolicitud, mensaje);
            }
        }
    });
};


$.fn.hasAttr = function (name) {
    var attr = this.attr(name);
    return (typeof attr !== typeof undefined && attr !== false);
};