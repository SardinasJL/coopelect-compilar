$(document).ready(function () {
    //Se verifica si el dispositivo tiene conexión a internet
    if(navigator.onLine == false){
        alert("El dispositivo no cuenta con una conexión a internet. Verifique e intente nuevamente.");
    }

    //Se proporciona funcionalidad a los enlaces

    var opciones = $("div.container.col-6");
    opciones.eq(0).click(function () {
        window.open("abonados.html", "_self");
    });
    opciones.eq(1).click(function () {
        window.open("avisos.html", "_self");
    });
    opciones.eq(2).click(function () {
        window.open("procedimientos.html", "_self");
    });
    opciones.eq(3).click(function () {
        window.open("contacto.html", "_self");
    });

});