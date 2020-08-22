$(document).ready(function () {
    Cargar_datos_de_la_url();

});

Cargar_datos_de_la_url = function () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var Abonado = url.searchParams.get("Abonado");
    var Cliente = url.searchParams.get("Cliente");
    var Servicio = url.searchParams.get("Servicio");
    Obtener_datos_abonado(Abonado, Cliente, Servicio);
    Obtener_detalle_deuda(Abonado, Servicio, Cliente);
    $("#btnExportar").click(function () {
        Exportar_pdf(Abonado, Servicio);
    });
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


Obtener_detalle_deuda = function (Abonado, Servicio, Cliente) {
    /**/


    $("#grillaDetalledeuda").jsGrid({
        width: "100%",
        //height: "400px",
        filtering: false,
        inserting: false,
        editing: false,
        sorting: true,
        autoload: true,
        paging: true,
        pageSize: 6,
        pageButtonCount: 5,
        deleteConfirm: "¿Desea eliminar el registro?",
        noDataContent: "No se encontró",
        pageNextText: "Siguiente",
        pagePrevText: "Anterior",
        pageFirstText: "Primero",
        pageLastText: "Último",
        invalidMessage: "El dato ingresado no es válido",
        loadMessage: "Por favor, espere...",
        controller: {
            loadData: function () {
                var deferred = $.Deferred();
                $.ajax({
                    type: "POST",
                    url: url + "/class/instancias.php",
                    data: {
                        Tabla: "Lecturacion",
                        Accion: "ver_detalle_deuda",
                        Abonado: Abonado,
                        Cliente: Cliente,
                        Servicio: Servicio
                    },
                    success: function (response) {
                        response = eval(response);
                        deferred.resolve(response);
                        //console.log(response);
                        if (response.length == 0) {
                            $("#grillaDetalledeuda").parent().hide();
                        } else $("#grillaDetalledeuda").parent().show();
                    }
                });
                return deferred.promise();
            }
        },
        fields: [{
            name: "EMISION",
            type: "text",
            title: "Emisión",
            width: 60,
            align: "center"
        }, {
            name: "IMPORTE",
            type: "text",
            title: "Importe",
            width: 60,
            align: "right",
        }]
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
    if (parseInt(json[0]["nro"]) > 1) {
        var Nro = json[0]["nro"] + " meses adeudados";
    }
    else {
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
    if (json[0]["MEDIDOR"] != '0') {
        $("#spanMedidor").html(json[0]["MEDIDOR"]);
        $("#spanMedidor").parent().show();
    } else $("#spanMedidor").parent().parent().hide();
    $("#spanRazon").html(json[0]["RAZON"]);
    $("#spanCalle").html(json[0]["calle"]);
    $("#spanNro").html(Nro);
    $("#spanImporte").html(json[0]["importe"]);
    $("#spanEstado").html(estado);

};

Exportar_pdf = function (Abonado, Servicio) {
    $.ajax({
        type: "POST",
        url: url + "/class/instancias.php",
        data: {
            Accion: "ver_detalle_deuda",
            Abonado: Abonado,
            Servicio: Servicio
        },
        success: function (json) {
            json = eval(json);
            //console.log(json);

            //var Abonado = $("#spanAbonado").html();
            var Razon = $("#spanRazon").html();
            var Calle = $("#spanCalle").html();
            var Medidor = $("#spanMedidor").html();
            var Importe = $("#spanImporte").html();
            var doc = new jsPDF('p', 'mm', [279.4, 215.9]); //Se establece el tamaño de la hoja "carta" en mm
            doc.setFontSize(10);
            doc.setFont("arial");
            doc.setFontType("bold");
            doc.setFontSize(8);
            doc.text(20, 20, 'Cooperativa de Servicios Publicos de Electricidad Tupiza R.L.');
            doc.setFontSize(12);
            doc.text(107.95, 30, 'DETALLE DE DEUDA', 'center');
            doc.setFontSize(10);
            doc.setFontType("bold");
            doc.text(20, 40, 'Abonado: ');
            doc.setFontType("normal");
            doc.text(40, 40, Abonado);
            doc.setFontType("bold");
            doc.text(20, 45, 'Razon: ');
            doc.setFontType("normal");
            doc.text(40, 45, Razon);
            if (Medidor != 0) {
                doc.setFontType("bold");
                doc.text(140.95, 40, 'Medidor: ');
                doc.setFontType("normal");
                doc.text(160.95, 40, Medidor);
            }
            doc.setFontType("bold");
            doc.text(140.95, 45, 'Calle: ');
            doc.setFontType("normal");
            doc.text(160.95, 45, Calle);
            doc.line(50, 50, 165.9, 50); //Línea horizontal superior
            doc.line(50, 50, 50, 55); //Línea vertical izquierda
            doc.setFontType("bold");
            doc.text(78.975, 54, 'EMISION', 'center');
            doc.line(107.95, 50, 107.95, 55); //Línea vertical centro
            doc.text(136.925, 54, 'IMPORTE (Bs.)', 'center');
            doc.line(165.9, 50, 165.9, 55); //Línea vertical derecha

            var y = 55;
            doc.setFontType("normal");
            for (var i = 0; i < json.length; i++) {

                doc.line(50, y, 165.9, y); //Línea horizontal superior
                doc.line(50, y, 50, y + 5); //Línea vertical izquierda
                doc.text(78.975, y + 4, json[i]["EMISION"], 'center');
                doc.line(107.95, y, 107.95, y + 5); //Línea vertical centro
                doc.text(160, y + 4, json[i]["IMPORTE"], 'right');
                doc.line(165.9, y, 165.9, y + 5); //Línea vertical derecha

                y = y + 5;
            }

            doc.line(50, y, 165.9, y);
            doc.setFontType("bold");
            doc.text(78.975, y + 4, "TOTAL", "center");
            doc.text(160, y + 4, Importe, 'right');

            //doc.save('Test.pdf'); //Esta línea permite descargar Test.pdf como si de una descarga normal se tratara
            //var pdfoutput = doc.output();
            //console.log(doc.output());
            savePDF("Deuda.pdf", doc.output())
        }
    });
};

function savePDF(fileName, fileData) {
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dir) {
        dir.getFile(fileName, {create: true, exclusive: false}, function (fileEntry) {
            fileEntry.createWriter(function (writer) {
                writer.onwrite = function (evt) {
                    console.log("escritura exitosa");
                    alert(fileName + " fue guardado en: " + "(memoria interna)/Android/data/com.coopelect.clientes/files");
                    abrirPDF();
                };
                console.log("escribiendo archivo");
                writer.write(fileData);
            })
        }, function () {
            console.log("ERROR AL GUARDAR EL ARCHIVO");
            alert("Error. El archivo no pudo ser guardado.");
        });
    });
}

abrirPDF = function(){
    cordova.plugins.fileOpener2.showOpenWithDialog(
        '/Android/data/com.coopelect.clientes/files/Deuda.pdf',
        'application/pdf',
        {
            error : function(e) {
                console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
            },
            success : function () {
                console.log('file opened successfully');
            },
            position : [0, 0]
        }
    );
};