var com = {};
com.bbva = com.bbva || {};
com.bbva.main = com.bbva.main || {};
com.bbva.main.Main = (function(wd, document) {
	return {
		init : function() {
		}
	}
})(window, document);

var validadorConsumo = false;
var validadorHipotecario = false;
var consumoIsChecked = false;
var hipotecarioIsChecked = false;

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
			if($(this).val()=="009")
				consumoIsChecked = true;
			if($(this).val()=="010")
				hipotecarioIsChecked = true;
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
	$("#lb_name1").keypress(function(event) {
		if (!isMinControlChar(event.which) && !isNameChar(event.which)) {
			event.preventDefault();
		}
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
		$("#facade").hide();
		$("#step_one").fadeIn("fast");
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
			$("#step_one").hide();
			if(consumoIsChecked || hipotecarioIsChecked){
				if(consumoIsChecked)
					$("#btnSimuladorConsumo").show();
				if(hipotecarioIsChecked)
					$("#btnSimuladorHipotecario").show();
			$("#step_two").fadeIn("fast");
			$('html,body').animate({
				scrollTop : $("#step_two").offset().top
			}, 'slow');
			$("#step_two").find('.blocked_disabled').css("z-index", "-1");
			$(this).addClass("button_disable").attr("disabled", "true");
			}
			else
				$("#next_two").click();
		});
	});

	/* --- PASO 2 --- */

	// activa el siguiente paso
	$("#next_two").click(function() {
		$("#step_two").hide();
		$("#step_three").fadeIn("fast");
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

function post() {
	$("#simConsumoIframe").empty();
	var iframe = $('<iframe></iframe>');

	iframe.attr("id", "iframeSim");
	iframe.attr("src", $("input[name=producto][value=009]").data("simulador"));
	iframe.attr("width", "900px");
	iframe.attr("height", "930px");
	iframe.attr("scrolling", "no");
	iframe.attr("frameborder", "0");

	$("#simConsumoIframe").append(iframe);

	iframe.submit();
}

$(".simulaConsumo").click(function(){
	validadorConsumo = true;
	$("#home-simuladores").hide();
	post();
	$("#iframeSim").fadeIn("fast");
	$("#simConsumoIframe").fadeIn("fast");
});

function hipotecario() {
	$("#simConsumoIframe").empty();
	var iframe = $('<iframe></iframe>');

	iframe.attr("id", "iframeSim");
	iframe.attr("src", $("input[name=producto][value=010]").data("simulador"));
	iframe.attr("width", "900px");
	iframe.attr("height", "930px");
	iframe.attr("scrolling", "no");
	iframe.attr("frameborder", "0");

	$("#simConsumoIframe").append(iframe);

	iframe.submit();
}

$(".simulaHipotecario").click(function(){
	validadorHipotecario = true;
	$("#home-simuladores").hide();
	hipotecario();
	$("#iframeSim").fadeIn("fast");
	$("#simConsumoIframe").fadeIn("fast");
});


$("#validadorCreditos").click(function() {
	if (consumoIsChecked && hipotecarioIsChecked){
		if(validadorConsumo && validadorHipotecario){
			$("#next_two").click();
		} else if (validadorConsumo && !validadorHipotecario){
			$("#home-simuladores").show();
			$("#btnSimuladorConsumo").hide();
			$("#btnSimuladorConsumoDisabled").show();
		} else if(!validadorConsumo && validadorHipotecario){
			$("#home-simuladores").show();
			$("#btnSimuladorHipotecario").hide();
			$("#btnSimuladorHipotecarioDisabled").show();
		}
	} else {
		$("#next_two").click();
	}
});

var ejemploProductosFu = [
		{
			"idProducto" : "006",
			"nombreProducto" : "Plan de Cuenta Corriente",
			"nombreCorto" : "PLANCC",
			"banner" : "https://www.bbva.cl/fbin/mult/3_tcm1106-530328.jpg",
			"bannerXs" : "https://www.bbva.cl/fbin/mult/hazte-cliente-responsive_tcm1106-534186.jpg",
			"icono" : "img/cuentacorriente.png",
			"orden" : 1,
			"simulador" : "",
			"oferta" : {
				"idProducto" : "006",
				"texto" : "Consigue mantención gratuita contratando otros productos.",
				"monto" : 0,
				"plazo" : 0,
				"pie" : 0,
				"tasa" : 0
			}
		},
		{
			"idProducto" : "009",
			"nombreProducto" : "Crédito de Consumo",
			"nombreCorto" : "CONSUMO",
			"banner" : "https://www.bbva.cl/fbin/mult/3_tcm1106-530328.jpg",
			"bannerXs" : "https://www.bbva.cl/fbin/mult/hazte-cliente-responsive_tcm1106-534186.jpg",
			"icono" : "img/creditoconsumo.png",
			"orden" : 2,
			"simulador" : "http://93.16.236.206:9081/Simulador-Web-Web/PreCarga?hcts=lOBPhjX61kx4SxeHUAYO7dVGuMDVFZVePxEvgD9UBPPVPGzEnSVAQQAwzORDmnifcZCP4rl8cqrR31mj57ritA==",
			"oferta" : {
				"idProducto" : "009",
				"texto" : "Pide $5.000.000 en 48 cuotas de $149.900, CAE 18,93%.",
				"monto" : 5000000,
				"plazo" : 48,
				"pie" : 0,
				"tasa" : 1.29
			}
		},
		{
			"idProducto" : "010",
			"nombreProducto" : "Crédito Hipotecario",
			"nombreCorto" : "HIPOTECARIO",
			"banner" : "https://www.bbva.cl/fbin/mult/3_tcm1106-530328.jpg",
			"bannerXs" : "https://www.bbva.cl/fbin/mult/hazte-cliente-responsive_tcm1106-534186.jpg",
			"icono" : "img/creditohipotecario.png",
			"orden" : 3,
			"simulador" : "http://93.16.236.206:9081/Simulador-Web-Web/PreCarga?hcts=lOBPhjX61kx4SxeHUAYO7fEO4RQqLw/PZXQSR69AXsus/n5GLbiRPwIeFPaQCj1HatyqGRyEsoMSko+3qCZG1w==",
			"oferta" : {
				"idProducto" : "010",
				"texto" : "Tasa 0,5% anual.",
				"monto" : 2000,
				"plazo" : 20,
				"pie" : 200,
				"tasa" : 0.5
			}
		}, {
			"idProducto" : "008",
			"nombreProducto" : "Tarjeta de Crédito",
			"nombreCorto" : "TARJETA",
			"banner" : "https://www.bbva.cl/fbin/mult/2_tcm1106-530327.jpg",
			"bannerXs" : "https://www.bbva.cl/fbin/mult/hazte-cliente-tarjetas-responsive_tcm1106-534187.jpg",
			"icono" : "img/tarjetadecredito.png",
			"orden" : 4,
			"simulador" : ""
		}, {
			"idProducto" : "007",
			"nombreProducto" : "BBVA Wallet",
			"nombreCorto" : "WALLET",
			"banner" : "https://www.bbva.cl/fbin/mult/1_tcm1106-530326.jpg",
			"bannerXs" : "https://www.bbva.cl/fbin/mult/wallet-responsive_tcm1106-534185.jpg",
			"icono" : "img/bbvawallet.png",
			"orden" : 5,
			"simulador" : ""
		}, {
			"idProducto" : "011",
			"nombreProducto" : "Visa Enjoy",
			"nombreCorto" : "VISAENJOY",
			"banner" : "https://www.bbva.cl/fbin/mult/1_tcm1106-530326.jpg",
			"bannerXs" : "https://www.bbva.cl/fbin/mult/wallet-responsive_tcm1106-534185.jpg",
			"icono" : "img/visaenjoy.png",
			"orden" : 6,
			"simulador" : ""
		} ];