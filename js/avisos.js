$(document).ready(function () {
    Cargar_avisos();
});

Cargar_avisos = function () {
    $.ajax({
        type: "POST",
        url: url + "/class/instancias.php",
        data: {
            Accion: "ver_avisos",
        },
        beforeSend: function () {
            $("#divCargando").html("<div class=\"spinner-border text-light\" role=\"status\"><span class=\"sr-only\">Loading...</span></div>");
        },
        success: function (json) {
            json = eval(json);
            Mostrar_avisos(json);
        },
        error: function () {
            alert("Verifique su conexión a internet e intente nuevamente.")
        },
        complete: function () {
            $("#divCargando").html("");
        }
    })
};

Mostrar_avisos = function (json) {
    //Se borran los mensajes escritos anteriormente
    $("#divAvisos").html("");
    //Se realiza un iteración para leer el objeto json
    for (var i = 0; i < json.length; i++) {
        var mensaje =
            `<div class="card bg-success col-md-6 mt-3">
          <h5 class="card-header">Aviso</h5>
          <div class="card-body">${json[i]["Nota"]}</div>
          </div>`;
        $(mensaje).appendTo("#divAvisos");
    }
};