var com = {};
com.bbva = com.bbva || {};
com.bbva.main = com.bbva.main || {};
com.bbva.main.Main = (function(wd, document) {
	return {
		init : function() {
		}
	}
})(window, document);

$(function() {
	$(document).foundation();
	com.bbva.main.Main.init();

	/* --- COMUN --- */

	var ORIGEN_FORM_UNICO = "FU";

	function getOfertas() {
		$("#lista-ofertas").show();
	}

	function pintarProductos(data) {
		var html = "";

		$.each(data, function(index) {
			var producto = data[index];
			html += '<div class="small-12 medium-4 large-4 column">';
			html += '<div class="producto-solicitar">';
			html += '<div class="checkbox input-checkbox">';
			html += '<input class="checkProducto" type="checkbox" name="producto" id="producto-' + index + '" value="'
					+ producto.idProducto + '" data-simulador="' + producto.simulador + '">';
			html += '</div>';
			html += '<img src="' + producto.icono + '">';
			html += '<p>' + producto.nombreProducto + '</p>';
			html += '</div>';
			html += '</div>';
		});

		$("#lista-productos").html(html);
		$("#lista-productos").show();

		// Pinta los productos seleccionados
		$(".checkProducto").click(function() {
			$(this).parent().parent().toggleClass("itemActivo");
			if ($("#step_two").find('.blocked_disabled').css("z-index") != -1) {
				if ($(".producto-solicitar.itemActivo").length != 0) {
					$("#next_one").removeClass("button_disable").removeAttr("disabled");
				} else {
					$("#next_one").addClass("button_disable").attr("disabled", true);
				}
			}
		});
	}

	function getProductos(rut, nombre) {

		$.ajax({
			type : "POST",
			url : "/FUBBVAform/getProductos",
			data : {
				rut : rut,
				nombre : nombre,
				origen: ORIGEN_FORM_UNICO
			},
			dataType : "json",
			success : function(data) {
				console.log(JSON.stringify(data));
				pintarProductos(data);
			},
			error : function(xhr, textStatus, errorThrown) {
				// alert(xhr.responseText + " " + errorThrown);
			}
		});
	}

	function getRegiones(region) {
		var $region = $(region);
		$region.empty();
		$region.append('<option value="">Selecciona una Región</option>');
		$region.selectmenu("refresh");
		$.ajax({
			type : "POST",
			url : "/FUBBVAform/getRegiones",
			contentType : "application/json; charset=utf-8",
			dataType : "json",
			success : function(data) {
				$.each(data, function(index) {
					$region.append('<option value="' + data[index].idRegion + '">' + data[index].nombreRegion
							+ '</option>');
				});
				$region.selectmenu("refresh");
			},
			error : function(xhr, textStatus, errorThrown) {
				// alert(xhr.responseText + " " + errorThrown);
			}
		});
	}

	function getComunas(region, comuna) {
		var id = $(region).val();
		var $comuna = $(comuna);
		$comuna.empty();
		$comuna.append('<option value="">Selecciona una Comuna</option>');
		$comuna.selectmenu("refresh");
		if (id !== '') {
			$.ajax({
				type : "POST",
				url : "/FUBBVAform/getComunas",
				data : {
					idRegion : id
				},
				contentType : "application/json; charset=utf-8",
				dataType : "json",
				success : function(data) {
					$.each(data, function(index) {
						$comuna.append('<option value="' + data[index].idComuna + '">' + data[index].nombreComuna
								+ '</option>');
					});
					$comuna.selectmenu("refresh");
				},
				error : function(xhr, textStatus, errorThrown) {
					// alert(xhr.responseText + " " + errorThrown);
				}
			});
		}
	}

	function showModalReingreso(data, yesFunction, noFunction) {
		$('#reingreso_fecha').text(
				data[0].fechaRechazo.dayOfMonth + "/" + (data[0].fechaRechazo.month + 1) + "/"
						+ data[0].fechaRechazo.year);
		var html = "<strong>" + data[0].tipoFormulario + "</strong>";
		for (var d = 1; d < data.length; d++) {
			if (data.length - 1 != d) {
				html += ", <strong>" + data[d].tipoFormulario + "</strong>";
			} else {
				html += " y <strong>" + data[d].tipoFormulario + "</strong>";
			}
		}
		$('#reingreso_productos').html(html);
		$('#reingreso-si').off('click').click(function() {
			$.modal.close();
			if (typeof yesFunction == "function") {
				yesFunction();
			}
		});
		$('#reingreso-no').off('click').click(function() {
			$.modal.close();
			if (typeof noFunction == "function") {
				noFunction();
			}
		});
		$('#modal-formulario').modal();
	}

	function validaReingreso(data, nextStepFunction) {
		$.ajax({
			type : "POST",
			url : "/FUBBVAform/reingreso",
			data : {
				rut : data.rut,
				productos : data.productos.join(","),
				origen: ORIGEN_FORM_UNICO
			},
			dataType : "json",
			success : function(data) {
				if (data.length != 0) {
					showModalReingreso(data, nextStepFunction);
				} else {
					nextStepFunction();
				}
			},
			error : function(xhr, textStatus, errorThrown) {
				// alert(xhr.responseText + " " + errorThrown);
			}
		});
	}

	function enviarSolicitud(data, nextStepFunction) {
		$.ajax({
			type : "POST",
			url : "/FUBBVAform/doForm",
			data : {
				rut : data.rut,
				nombre : data.nombre,
				telefono : data.telefono,
				correo : data.email,
				region : data.region,
				comuna : data.comuna,
				emailRobot : data.emailRobot,
				codigoProducto : data.productos.join(","),
				origen: ORIGEN_FORM_UNICO
			},
			dataType : "json",
			success : function(data) {
				if (data.ok) {
					nextStepFunction();
				}
			},
			error : function(xhr, textStatus, errorThrown) {
				// alert(xhr.responseText + " " + errorThrown);
			}
		});
	}

	function getArrayProductos(productos) {
		var array = [];
		$(productos).each(function() {
			array.push($(this).val());
		});
		return array;
	}

	/* --- PASO 0 --- */

	$("#lb_name1").focus(function() {
		clearFieldError(this);
	});

	$("#lb_name1").blur(function() {
		validateNameFiled(this);
		$(".nombre-solicitante").text($("#lb_name1").val());
	});

	$("#lb_rut").focus(function() {
		clearFieldError(this);
	});

	$("#lb_rut").blur(function() {
		validateRutField(this);
	});
	$("#lb_rut").keypress(function(event) {
		if (!isMinControlChar(event.which) && !isRutChar(event.which)) {
			event.preventDefault();
		}
	});
	$("#lb_rut").keyup(function(event) {
		var rut = $(this).val();
		var format = formatRut(rut);
		$(this).val(format);
	});

	// Activa el siguiente paso
	$("#next_zero").click(function() {
		validateNameFiled("#lb_name1");
		validateRutField("#lb_rut");
		if (hasInvalidFields(".campos-inicio")) {
			return;
		}
		$(".nombre-solicitante").text($("#lb_name1").val());
		// Obtiene y pinta los productos
		getOfertas();
		getProductos($("#lb_rut").val(), $("#lb_name1").val());
		$('html,body').animate({
			scrollTop : $("#step_one").offset().top
		}, 'slow');
		$("#step_one").find('.blocked_disabled').css("z-index", "-1");
		$(this).addClass("button_disable").attr("disabled", "true");
	});

	/* --- PASO 1 --- */

	// activa el siguiente paso
	$("#next_one").click(function() {
		validaReingreso({
			rut : $("#lb_rut").val(),
			productos : getArrayProductos(".itemActivo .checkProducto")
		}, function() {
			console.log("ir al paso dos");
			$('html,body').animate({
				scrollTop : $("#step_two").offset().top
			}, 'slow');
			$("#step_two").find('.blocked_disabled').css("z-index", "-1");
			$(this).addClass("button_disable").attr("disabled", "true");
		});
	});

	/* --- PASO 2 --- */

	// activa el siguiente paso
	$("#next_two").click(function() {
		getRegiones("#region");
		getComunas("#region", "#comuna");
		$('html,body').animate({
			scrollTop : $("#step_three").offset().top
		}, 'slow');
		$("#step_three").find('.blocked_disabled').css("z-index", "-1");
		$(this).addClass("button_disable").attr("disabled", "true");
	});

	/* --- PASO 3 --- */

	$("#field-telefono").focus(function() {
		clearFieldError(this);
	});
	$("#field-telefono").blur(function() {
		validatePhoneField(this);
	});
	$("#field-telefono").keypress(function(event) {
		if (!isMinControlChar(event.which) && !isNumberChar(event.which) || $(this).val().length == 9) {
			event.preventDefault();
		}
	});

	$("#field-email").focus(function() {
		clearFieldError(this);
	});
	$("#field-email").blur(function() {
		validateEmailField(this);
	});
	$("#field-email").keypress(function(event) {
		if (!isMinControlChar(event.which) && !isEmailChar(event.which)) {
			event.preventDefault();
		}
	});

	// Comunas y regiones
	$("#region").selectmenu({
		change : function(event, ui) {
			getComunas("#region", "#comuna");
		}
	});
	$("#comuna").selectmenu();

	// mensaje de éxito al enviar solicitud
	$("#enviarSolicitud").click(function() {
		validatePhoneField("#field-telefono");
		validateEmailField("#field-email");
		if (hasInvalidFields("#step_three") || $("#region").val() === "" || $("#comuna").val() === "") {
			return;
		}
		enviarSolicitud({
			rut : $("#lb_rut").val(),
			nombre : $("#lb_name1").val(),
			telefono : $("#field-telefono").val(),
			email : $("#field-email").val(),
			region : $("#region").val(),
			comuna : $("#comuna").val(),
			emailRobot : $("#emailRobot").val(),
			productos : getArrayProductos(".itemActivo .checkProducto")
		}, function() {
			$(".formcontent").hide();
			$(".solicitudEnviada").fadeIn("fast");
			$('html,body').animate({
				scrollTop : $(".solicitudEnviada").offset().top
			}, 'slow');
		});

	});
});