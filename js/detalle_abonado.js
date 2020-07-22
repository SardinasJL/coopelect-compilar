$(document).ready(function () {
    Cargar_datos_de_la_url();
});

Cargar_datos_de_la_url = function () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var Abonado = url.searchParams.get("Abonado");
    var Cliente = url.searchParams.get("Cliente");
    var Servicio = url.searchParams.get("Servicio");
    Obtener_datos_abonado(Abonado, Cliente, Servicio)
};

Obtener_datos_abonado = function (Abonado, Cliente, Servicio) {
    $.ajax({
        type: "POST",
        url: url + "/class/instancias.php",
        data: {
            Accion: "ver_deuda",
            Abonado: Abonado,
            Cliente: Cliente,
            Servicio: Servicio
        },
        beforeSend: function () {
            $("#divCargando").html("<div class=\"spinner-border text-light\" role=\"status\"><span class=\"sr-only\">Loading...</span></div>");
        },
        success: function (json) {
            json = eval(json);
            Escribir_datos_abonado(json);
            //console.log(json);
        },
        error: function () {
            alert("Verifique su conexión a internet e intente nuevamente.")
        },
        complete: function () {
            $("#divCargando").html("");
        }
    });
};

Escribir_datos_abonado = function (json) {
    switch (json[0]["SERVICIO"]) {
        case "1":
            var servicio = "Energía eléctrica";
            break;
        case "2":
            var servicio = "T.V. Cable";
            break;
    }
    if(parseInt(json[0]["nro"]) > 1){
        var Nro = json[0]["nro"] + " meses adeudados";
    }
    else{
        var Nro = json[0]["nro"] + " mes adeudado";
    }
    switch (json[0]["ESTADO"]) {
        case "N":
            var estado = "Estado: Normal";
            break;
        case "R":
            var estado = "Estado: Retirado";
            break;
        case "X":
            var estado = "Estado: En proceso de conexión";
            break;
        case "S":
            var estado = "Estado: Suspendido";
            break;
        default:
            var estado = "ND";
            break;
    }

    $("#spanCliente").html(json[0]["CLIENTE"]);
    $("#spanAbonado").html(json[0]["ABONADO"]);
    $("#spanServicio").html(servicio);
    $("#spanRazon").html(json[0]["RAZON"]);
    $("#spanCalle").html(json[0]["calle"]);
    $("#spanNro").html(Nro);
    $("#spanImporte").html(json[0]["importe"]);
    $("#spanEstado").html(estado);

};

