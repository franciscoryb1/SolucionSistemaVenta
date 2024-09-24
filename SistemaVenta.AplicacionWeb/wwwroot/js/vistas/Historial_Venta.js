const VISTA_BUSQUEDA = {
    busquedaFecha: () => {
        $("#txtFechaInicio").val("")
        $("#txtFechaFin").val("")
        $("#txtNumeroVenta").val("")
        $(".busqueda-fecha").show()
        $(".busqueda-venta").hide()
    },
    busquedaVenta: () => {
        $("#txtFechaInicio").val("")
        $("#txtFechaFin").val("")
        $("#txtNumeroVenta").val("")
        $(".busqueda-fecha").hide()
        $(".busqueda-venta").show()
    }
}

// Datepicker busqueda por fecha
$(document).ready(function () {
    VISTA_BUSQUEDA["busquedaFecha"]();

    $.datepicker.setDefaults($.datepicker.regional["es"]);

    $("#txtFechaInicio").datepicker({ dateFormat: "dd/mm/yy" });
    $("#txtFechaFin").datepicker({ dateFormat: "dd/mm/yy" });
});

// Buscar por FECHA o VENTA
$("#cboBuscarPor").on("change", function () {
    if ($("#cboBuscarPor").val() === "fecha") {
        VISTA_BUSQUEDA["busquedaFecha"]();
    } else {
        VISTA_BUSQUEDA["busquedaVenta"]();
    }
});

$("#btnBuscar").on("click", function () {
    if ($("#cboBuscarPor").val() === "fecha") {
        if ($("#txtFechaInicio").val().trim() === "" || $("#txtFechaFin").val().trim() === "") {
            toastr.warning("", "Debe ingresar fecha inicio y fin");
            return;
        }
    } else {
        if ($("#txtNumeroVenta").val().trim() === "") {
            toastr.warning("", "Debe ingresar el numero de venta");
            return;
        }
    }

    let numeroVenta = $("#txtNumeroVenta").val();
    let fechaInicio = $("#txtFechaInicio").val();
    let fechaFin = $("#txtFechaFin").val();

    $(".card-body").find("div.row").LoadingOverlay("show");

    fetch(`/Venta/Historial?numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
        .then(response => {
            $(".card-body").find("div.row").LoadingOverlay("hide");
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            $("#tbventa tbody").html("");
            if (responseJson.length > 0) { // Corregido: lenght -> length
                responseJson.forEach((venta) => {
                    $("#tbventa tbody").append(
                        $("<tr>").append(
                            $("<td>").text(venta.fechaRegistro),
                            $("<td>").text(venta.numeroVenta),
                            $("<td>").text(venta.tipoDocumentoVenta),
                            $("<td>").text(venta.documentoCliente),
                            $("<td>").text(venta.nombreCliente),
                            $("<td>").text(venta.total),
                            $("<td>").append(
                                $("<button>").addClass("btn btn-info btn-sm").append(
                                    $("<i>").addClass("fas fa-eye")
                                ).data("venta", venta)
                            )
                        )
                    );
                });
            } else {
                toastr.info("", "No se encontraron ventas");
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            toastr.error("", "Hubo un error al obtener los datos");
        });
});
