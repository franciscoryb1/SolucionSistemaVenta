﻿let ValorImpuesto = 0;

$(document).ready(function () {

    fetch("/Venta/ListaTipoDocumentoVenta")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            if (responseJson.length > 0) {
                responseJson.forEach((item) => {
                    $("#cboTipoDocumentoVenta").append(
                        $("<option>").val(item.IdTipoDocumentoVenta).text(item.descripcion)
                    );
                });
            }
        });

    fetch("/Negocio/Obtener")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            if (responseJson.estado) {
                const d = responseJson.objeto;
                console.log(d);
                $("#inputGroupSubTotal").text(`Sub Total - ${d.simboloMoneda}`);
                $("#inputGroupIGV").text(`IGV(${d.porcentajeImpuesto}%) - ${d.simboloMoneda}`);
                $("#inputGroupTotal").text(`Total - ${d.simboloMoneda}`);

                ValorImpuesto = parseFloat(d.porcentajeImpuesto);
            }
        });

    $("#cboBuscarProducto").select2({
        ajax: {
            url: "/Venta/ObtenerProductos",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {
                return {
                    busqueda: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data.map((item) => ({
                        id: item.idProducto,
                        text: item.descripcion,
                        marca: item.marca,
                        categoria: item.nombreCategoria,
                        urlImagen: item.urlImagen,
                        precio: parseFloat(item.precio)
                    }))
                };
            }
        },
        language: "es",
        placeholder: 'Buscar Producto',
        minimumInputLength: 1,
        templateResult: formatoResultados
    });

});

function formatoResultados(data) {
    if (data.loading) {
        return data.text;
    }

    let contenedor = $(
        `
        <table width="100%">
            <tr>
                <td style="width:60px">
                    <img style="height:60px; width:60px; margin-right:10px;" src="${data.urlImagen}"/>
                </td>
                <td>
                    <p style="font-weight:bolder; margin: 2px;">${data.marca}</p>
                    <p style="margin: 2px;">${data.text}</p>
                </td>
            </tr>
        </table>`
    );
    return contenedor;
}

$(document).on("select2:open", function () {
    document.querySelector(".select2-search__field").focus();
});

let ProductosParaVenta = [];
$("#cboBuscarProducto").on("select2:select", function (e) {
    const data = e.params.data;

    let producto_encontrado = ProductosParaVenta.filter(p => p.idProducto == data.id);
    if (producto_encontrado.length > 0) {
        $("#cboBuscarProducto").val("").trigger("change");
        toastr.warning("", "El producto ya fue agregado");
        return false;
    }
    swal({
        title: data.marca,
        text: data.text,
        imageUrl: data.urlImagen,
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: "Ingrese Cantidad"
    },
        function (valor) {

            if (valor === false) return false;
            if (valor === "") {
                toastr.warning("", "Necesita ingresar la cantidad");
                return false;
            }
            if (isNaN(parseInt(valor))) {
                toastr.warning("", "Debe ingresar un valor numérico");
                return false;
            }

            let producto = {
                idProducto: data.id,
                marcaProducto: data.marca,
                descripcionProducto: data.text,
                categoriaProducto: data.categoria,
                cantidad: parseInt(valor),
                precio: data.precio.toString(),
                total: (parseFloat(valor) * data.precio).toString()
            };
            ProductosParaVenta.push(producto);

            mostrarProductos_Precios();
            $("#cboBuscarProducto").val("").trigger("change");
            swal.close();
        }
    );

});

function mostrarProductos_Precios() {

    let total = 0;
    let igv = 0;
    let subtotal = 0;
    let porcentaje = ValorImpuesto / 100;

    $("#tbProducto tbody").html("");

    ProductosParaVenta.forEach((item) => {

        total += parseFloat(item.total);

        $("#tbProducto tbody").append(
            $("<tr>").append(
                $("<td>").append(
                    $("<button>").addClass("btn btn-danger btn-eliminar btn-sm").append(
                        $("<i>").addClass("fas fa-trash-alt")
                    ).data("idProducto", item.idProducto)
                ),
                $("<td>").text(item.descripcionProducto),
                $("<td>").text(item.cantidad),
                $("<td>").text(item.precio),
                $("<td>").text(item.total)
            )
        );
    });

    subtotal = total / (1 + porcentaje);
    igv = total - subtotal;

    $("#txtSubTotal").val(subtotal.toFixed(2));
    $("#txtIGV").val(igv.toFixed(2));
    $("#txtTotal").val(total.toFixed(2));
}

$(document).on("click", "button.btn-eliminar", function () {
    const _idProducto = $(this).data("idProducto");

    ProductosParaVenta = ProductosParaVenta.filter(p => p.idProducto != _idProducto);

    mostrarProductos_Precios();
});


$("#btnTerminarVenta").on("click", function () {
    if (ProductosParaVenta.length < 1) {
        toastr.warning("", "Debe ingresar productos");
        return;
    }

    const vmDetalleVenta = ProductosParaVenta;

    const modelo = {
        IdTipoDocumentoVenta: parseInt($("#cboTipoDocumentoVenta").val(), 10) || 0,
        DocumentoCliente: $("#txtDocumentoCliente").val() || "",
        NombreCliente: $("#txtNombreCliente").val() || "",
        SubTotal: parseFloat($("#txtSubtotal").val()) || 0,
        ImpuestoTotal: parseFloat($("#txtIGV").val()) || 0,
        Total: parseFloat($("#txtTotal").val()) || 0,
        DetalleVenta: vmDetalleVenta
    };

    $("#btnTerminarVenta").LoadingOverlay("show");

    fetch("/Venta/RegistrarVenta", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(modelo)
    })
        .then(response => {
            $("#btnTerminarVenta").LoadingOverlay("hide");
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || "Error en la solicitud");
                });
            }
            return response.json();
        })
        .then(responseJson => {
            if (responseJson.estado) {
                ProductosParaVenta = [];
                mostrarProductos_Precios();
                $("#txtDocumentoCliente").val("");
                $("#txtNombreCliente").val("");
                $("#cboTipoDocumentoVenta").val($("#cboTipoDocumentoVenta option:first").val());

                swal("Registrado!", `Número de venta: ${responseJson.objeto.numeroVenta}`, "success");
            } else {
                swal("Lo sentimos", responseJson.mensaje || "No se pudo registrar la venta", "error");
            }
        })
        .catch(error => {
            $("#btnTerminarVenta").LoadingOverlay("hide");
            swal("Error", `Hubo un problema al registrar la venta: ${error.message}`, "error");
        });
});
