$(document).ready(function () {
    //console.log(localStorage);
    //ordenar_localstorage();
    //Se leen todos los registros guardados en la BD local

    $('.mdb-select').materialSelect();

    Leer_de_BD_local();

    //Evento para el botón añadir (ícono de cruz)
    $("#btnModalAñadir").click(function () {
        //Se llama al modal, se resetea el formulario del modal y se quita la clase was-validated
        $("#modalAñadir").modal('show');
        $("#formCuenta")[0].reset();
        //Para que el reset sea completo se borra la clase active de todos los label y de todos los i
        $("#formCuenta label").removeClass("active");
        $("#formCuenta i").removeClass("active");
        setTimeout(function () {
            $("#txtCliente").focus();
        }, 600);

        $("#formCuenta").removeClass("was-validated");
    });

    //Evento para el botón guardarcuenta (botón dentro del modal)
    $("#btnGuardarcuenta").click(function () {
        Añadircuenta();
    });

    //Evento para el txtbox abonado (cuando presiona enter, se procede al guardado)
    $("#txtAbonado").keyup(function (event) {
       if(event.keyCode == 13){
           Añadircuenta();
       };
    });

});

Añadircuenta = function () {
    //Se verifica si el formulario está validado
    var formCuenta = $("#formCuenta");
    if (formCuenta[0].checkValidity() == true) {
        //Se leen los datos de los campos del formulario
        var Cliente = $("#txtCliente").val(); //Tomar nota que el nro de CI es el nro de Cliente
        var Abonado = $("#txtAbonado").val();
        var Servicio = $("#cbxServicio").val();
        //Se realiza la petición ajax
        $.ajax({
            type: "POST",
            url: url + "/class/instancias.php",
            data: {
                Accion: "ver_deuda",
                Abonado: Abonado,
                Cliente: Cliente,
                Servicio: Servicio
            },
            success: function (json) {
                json = eval(json);
                //Insertar el registro dentro de una base de datos local
                if (json[0] != null) {
                    Insertar_en_BD_local(json[0]);
                    //Finaliza cerrando el modal
                    $("#modalAñadir").modal("hide");
                } else {
                    alert("El CI y el Nro. de abonado no se encuentran registrados.\n Verifique e intente nuevamente");
                }
            },
            error: function () {
                alert("Verifique su conexión a internet e intente nuevamente.")
            }
        })
    } else {
        //Si el formulario no fue validado se añade la clase correspondiente, para mostrar los errores al usuario
        formCuenta.addClass("was-validated");
    }
};

Insertar_en_BD_local = function (datos_cuenta) {
    var id = new Date(); //El tiempo se toma como una id
    if (localStorage.length <= 20) {
        localStorage.setItem(id.toString(), JSON.stringify(datos_cuenta));
    } else {
        alert("Puede registrar un máximo de 20 cuentas");
    }
    Leer_de_BD_local();
};

/*
 Esta función sirve para recuperar todos los registros guardados en la BD local (localStorage) y convertirlos a HTML
 */

Leer_de_BD_local = function () {
    $("#divCuentas").html(""); //Se borra el contenido del div
    for (var i = 0; i < localStorage.length; i++) {
        var id = localStorage.key(i);
        var json = localStorage.getItem(id);
        json = JSON.parse(json);
        $.ajax({
            type: "POST",
            url: url + "/class/instancias.php",
            async: false,
            data: {
                Accion: "ver_deuda",
                Abonado: json["ABONADO"],
                Cliente: json["CLIENTE"],
                Servicio: json["SERVICIO"]
            },
            beforeSend: function () {
                $("#divCargando").html("<div class=\"spinner-border text-light\" role=\"status\"><span class=\"sr-only\">Loading...</span></div>");
            },
            success: function (nuevojson) {

                nuevojson = eval(nuevojson);
                //var html_a_insertar = `<h1>holi ${nuevojson[0]["ABONADO"]}</h1>`;
                switch (nuevojson[0]["SERVICIO"]) {
                    case "1":
                        var servicio = "Energía eléctrica";
                        break;
                    case "2":
                        var servicio = "T.V. Cable";
                        break;
                }
                var html_a_insertar = `
                
        <div class="container col-md-6 mt-3 tarjeta-pepe">
            <div class="card teal darken-4 text-white ">
                <div class="card-body waves-effect">
                    <table class="container col-12" data-id="${id}">
                        <tr>
                            <td><i class="fal fa-id-card"> </i></td>
                            <td><span id="spanCliente">${nuevojson[0]["CLIENTE"]}</span></td>
                            <td class="text-center" rowspan="2" style="border: #fff 1px solid;">
                                Bs.<br>
                                ${nuevojson[0]["importe"]}
                            </td>
                        </tr>
                        <tr>
                            <td><i class="fal fa-user"> </i></td>
                            <td><span id="spanAbonado">${nuevojson[0]["ABONADO"]}</span></td>
                        </tr>
                        <tr>
                            <td><i class="fal fa-hand-holding-magic"> </i></td>
                            <td><span id="spanServicio">${servicio}</span></td>
                        </tr>
                        <tr>
                            <td><i class="fal fa-user-circle"> </i></td>
                            <td colspan="2"><span id="spanRazon">${nuevojson[0]["RAZON"]}</span></td>
                        </tr>
                        <tr>
                            <td><i class="fal fa-home"> </i></td>
                            <td colspan="2"><span id="spanCalle">${nuevojson[0]["calle"]}</span></td>
                        </tr>
                    </table>
                </div>
                <div class="card-footer">
                    <span class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Ver más...</span>
                    <div class="dropdown-menu dropdown-menu-left">
                        <button class="dropdown-item btnDetalle" type="button" data-id="${id}">Detalle <i class="fal fa-info-square"></i></button>
                        <button class="dropdown-item btnEliminar" type="button" data-id="${id}">Eliminar <i class="fal fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        </div>
                                
                                      `;
                $("#divCuentas").append(html_a_insertar);

            }, //fin del success
            error: function () {
                alert("Verifique su conexión a internet e intente nuevamente.");
                i = localStorage.length; //En caso de error, i = localStorage.length, esto para salir del bucle for y dejar de iterar
            },
            complete: function () {
                $("#divCargando").html("");
            }
        })
    }
    //Se proporciona funcionalidad a todos los botones btnEliminar
    $("button.btnEliminar").click(function () {
        var este_boton = $(this);
        var id = este_boton.attr("data-id");
        este_boton.parents("div.tarjeta-pepe").remove();
        localStorage.removeItem(id);
    });
    //Se proporciona funcionalidad a todos las tablas

    $("table").click(function () {
        var esta_tabla = $(this);
        var id = esta_tabla.attr("data-id");
        if (id != null) {
            var json = localStorage.getItem(id);
            json = JSON.parse(json);
            window.open("detalle_abonado.html?Abonado=" + json["ABONADO"] + "&Cliente=" + json["CLIENTE"] + "&Servicio=" + json["SERVICIO"], "_self");
        }
    });

    $("button.btnDetalle").click(function () {
        var este_boton = $(this);
        var id = este_boton.attr("data-id");
        if (id != null) {
            var json = localStorage.getItem(id);
            json = JSON.parse(json);
            window.open("detalle_abonado.html?Abonado=" + json["ABONADO"] + "&Cliente=" + json["CLIENTE"] + "&Servicio=" + json["SERVICIO"], "_self");
        }
    });

};

/*
Función para ordenar los datos almacenados en localStorage, según el algoritmo de la burbuja, de antiguo a moderno
Input:
Output: Un array con los datos ordenados

ordenar_localstorage = function () {
    var claves_ordenadas = new Array();

    for(var i = 0; i<localStorage.length; i++){
        for(var j=1; j<localStorage.length; j++){
            var elemento_anterior = new Date(localStorage.key(i));
            var elemento_posterior = new Date(localStorage.key(j));
            if(elemento_anterior > elemento_posterior){
                claves_ordenadas[i] =

            }
        }
    }


};
*/