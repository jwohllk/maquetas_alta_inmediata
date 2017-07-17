var com = {};
com.bbva = com.bbva || {};
com.bbva.main = com.bbva.main || {};
com.bbva.main.Main = (function(wd, document) {
	return {
		init : function() {
		}
	}
})(window, document);

var validadorConsumo    = false;
var validadorHipotecario= false;
var validadorBeneficios = false;
var consumoIsChecked    = false;
var hipotecarioIsChecked= false;
var beneficiosIsChecked = false;
var onlyConsumo         = false;
var onlyHipotecario     = false;
var onlyBeneficios      = false;
var ofertaPlanCuenta    = false;
var ofertaConsumo       = false;
var ofertaHipotecario   = false;
var ofertaTC            = false;
var contadorOfertas     = 0;
var isPlanCtaJoven      = false;

var dataSimuladores = {
	urlHipotecario       : "",
	simulacionHipotecario: false,
	ajaxHipotecario      : "",
	simulacionConsumo    : false,
	ajaxConsumo          : "",
	urlConsumo           : "",
	dataForm             : [],
	isInterest           : true,
	urlIframeSimulador   : "",
	isUniversitario      : false,
	isConvenio           : false
};

$(function() {

	$(document).foundation();
	com.bbva.main.Main.init();

	/* --- COMUN --- */

	var ORIGEN_FORM_UNICO = "FU";

	/*	@brief		Nombre cliente largo 15
	*/
	function pintarNombre() {
		var name = $("#lb_name1").val().match(/[a-zA-Z-áéíóúÁÉÍÓÚ]+/g)[0];
		if (name.length > 15)
			$(".nombre-solicitante").text(name.substring(0, 15));
		else
			$(".nombre-solicitante").text(name.replace(/^./, name[0].toUpperCase()));
	}

	function getAcceso(data) {
		if (dataSimuladores.dataForm.ofertas["009"] != null) {
			if (dataSimuladores.dataForm.ofertas["009"].isHermes) {
				if (dataSimuladores.dataForm.ofertas["isApproved"] != null) {
					$("#next_zero").removeClass("button_disable").removeAttr("disabled", false);
					if (dataSimuladores.dataForm.ofertas["isApproved"].isApproved == 0 || dataSimuladores.dataForm.ofertas["isApproved"].isApproved == 2) {
						$("#creditoAprovado").text("Preaprobada");
						$("#montoCredito").text("$" + utilsNumber.numberToFormat(dataSimuladores.dataForm.ofertas["009"].monto));
						showModalLogin(data, beginForProduct, iniciarLogin);
					} else if (dataSimuladores.dataForm.ofertas["isApproved"].isApproved == 1) {
						$("#creditoAprovado").text("Aprobada");
						$("#montoCredito").text("$" + utilsNumber.numberToFormat(dataSimuladores.dataForm.ofertas["009"].monto));
						showModalLogin(data, beginForProduct, iniciarLogin);
					} else {
						beginForProduct()
					}
				}
			} else {
				beginForProduct();
			}
		} else {
			beginForProduct();
		}
	}

	window.getAcceso = getAcceso;

	function getOfertas() {

		$.each(dataSimuladores.dataForm.ofertas, function(i, item) {
			if (item.clientOffer) {
				if (item.idProducto == "006") {
					// pinta oferta plan cuenta
					$("#divOfertaPlanCuenta").show();
					ofertaPlanCuenta = true;
					contadorOfertas = contadorOfertas + 1;
				} else if (item.idProducto == "008") {
					// pinta oferta TC
					$("#montoPreaprobadoTC").text("$" + utilsNumber.numberToFormat(item.monto) + " ");
					$("#divOfertaTarjetaCredito").show();
					ofertaTC = true;
					contadorOfertas = contadorOfertas + 1;
				} else if (item.idProducto == "009") {
					// pinta oferta consumo
					$("#montoPreaprobadoConsumo").text("$" + utilsNumber.numberToFormat(item.monto) + " ");
					$("#divOfertaConsumo").show();
					ofertaConsumo = true;
					contadorOfertas = contadorOfertas + 1;
				} else if (item.idProducto == "010") {
					// pinta oferta hipotecario
					$("#montoPreaprobadoHipotecario").text(utilsNumber.numberToFormat(item.monto) + " UF ");
					$("#divOfertaHipotecario").show();
					ofertaHipotecario = true;
					contadorOfertas = contadorOfertas + 1;
				}
			}
		});

		$("#lista-ofertas").show();

		//Sin ofertas
		if (contadorOfertas == 0) {
			$("#lista-ofertas").hide();

		//Cantidad de ofertas: 1
		} else if (contadorOfertas == 1) {
			$("#tituloOfertas").html("¡Felicidades, tenemos un <strong>producto con oferta</strong> pre aprobada para ti!")
			$(".divOferta").addClass("small-12 medium-12 large-12");
			$(".divOferta").css("text-align", "center");

		//Cantidad de ofertas: 2
		} else if (contadorOfertas == 2) {
			$(".divOferta").addClass("small-12 medium-6 large-6");

		//Cantidad de ofertas: 3
		} else if (contadorOfertas == 3) {
			$(".divOferta").addClass("small-12 medium-4 large-4");

		//Cantidad de ofertas: >3
		} else if (contadorOfertas > 3) {
			$(".divOferta").addClass("small-12 medium-4 large-4");
			$("#divOfertaPlanCuenta").show();
			$("#divOfertaConsumo").show();
			$("#divOfertaHipotecario").show();
			$("#divOfertaTarjetaCredito").hide();
		}
	}

	function pintarProductos(data) {

		var html = "";

		var productosForm = data.formulario.productosForm;
		var urlSimuladores = data.simuladores;

		$.each(productosForm, function(index) {

			var pf = productosForm[index];
			var producto = pf.producto;

			//Comentada a peticion explicita de D&D
			//var premarcar = pf.premarcar;
			var premarcar = false;

			var simulador = producto.simulador
			var urlSimulador = urlSimuladores[producto.idProducto];
			if (urlSimulador === null || urlSimulador === undefined) {
				urlSimulador = "";
			}

			html += '<div class="small-12 medium-6 large-4 column" style="float:left !important;">';
			html += '<div style="cursor:pointer" class="checkDiv producto-solicitar' + (premarcar ? ' itemActivo' : '') + '">';
			html += '<div class="checks_condition" style="width:100%">'

			//Agregado por integracion Cloud idProductoCloud, idSubProductoCloud
			html += '<input type="checkbox" class="checkProducto" style="cursor:pointer" id="producto-' + index
					+ '" value="' + producto.idProducto + '" data-simulador="' + simulador + '" data-url-simulador="'
					+ urlSimulador + '"' + (premarcar ? ' checked="checked"' : '') + ' idproductocloud="' + producto.idProductoCloud + '" idsubproductocloud="' + producto.idSubProductoCloud + '">'
			html += '<label for="lb_exo_acc"></label>'
			html += '</div>';
			html += '<div style="height: 73px;"><img src="fu/' + producto.icono + '"></div>';
			html += '<p style="font-size:12px;">' + producto.nombreProducto + '</p>';
			html += '</div>';
			html += '</div>';
		});

		$("#lista-productos").html(html);
		$("#lista-productos").show();

		function enableNextOne() {
			if ($("#step_two").find('.blocked_disabled').css("z-index") != -1) {
				if ($(".producto-solicitar.itemActivo").length != 0) {
					$("#next_one").removeClass("button_disable").removeAttr("disabled");
				} else {
					$("#next_one").addClass("button_disable").attr("disabled", true);
				}
			}
		}

		enableNextOne();

		// Pinta los productos seleccionados
		$(".checkProducto").click(function() {

			var divItemActivo = $(this).parent().parent();

			if (divItemActivo.hasClass("itemActivo")) {
				divItemActivo.addClass("itemActivo");
			} else {
				divItemActivo.removeClass("itemActivo");
			}

			var inputCheckbox = $(this);

			if (inputCheckbox.is(':checked')) {
				inputCheckbox.prop('checked', '');
				inputCheckbox.removeAttr('checked');
			} else {
				inputCheckbox.prop('checked', 'checked');
			}

			enableNextOne();

		});

		$(".checkDiv").click(function() {

			$(this).toggleClass("itemActivo");

			var inputCheckbox = $(this).children().children();

			if (inputCheckbox.is(':checked')) {
				inputCheckbox.prop('checked', '');
				inputCheckbox.removeAttr('checked');
			} else {
				inputCheckbox.prop('checked', 'checked');
			}

			enableNextOne();

		});

	}

	function getFormData(rut, nombre) {

		dataSimuladores.dataForm = [];
		$.ajax({
			type : "POST",
			url : "/FUBBVAform/getForm",
			data : {
				rut : rut,
				nombre : nombre,
				origen : ORIGEN_FORM_UNICO
			},
			cache : false,
			dataType : "json",
			success : function(data) {

				dataSimuladores.dataForm = data;
				getAcceso(data);

				//Rescata informacion productos disponibles
				BBVACloud.productosDisponibles  = data.formulario.productosForm;
				BBVACloud.simuladoresDisponibles= data.simuladores;

			},
			error : function(xhr, textStatus, errorThrown) {
				console.log(xhr.responseText);
				console.log(errorThrown);
			},
			complete: function(){
				log('::funico getFormData() complete');
				esClienteBBVA(BBVACloud.cliente.rut,BBVACloud.cliente.nombreCompleto);
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

	function mostrarLogin() {
		$('#pantallaAcceso').hide();
		$('#title_modal_login').hide();
		$('#pantallaLogin').show();
	}

	function showModalDefecto() {
		$('#pantallaAcceso').show();
		$('#title_modal_login').show();
		$('#pantallaLogin').hide();
	}

	function iniciarLogin() {
		var rut = $("#rut").text().replace(/\./g, '').replace('-', '');
		var clave = $("#clave").val();

		if (validateClaveField()) {
			$('#accesoLogin').addClass("button_disable").attr("disabled", true);
			// ir a sitio privado: login con contexto
			var form = '<form action="' + dataSimuladores.dataForm.simuladores["loginContexto"] + '" target="_top" method="post">';
			form += '<input type="hidden" name="IdPers" value="1"/>';
			form += '<input type="hidden" name="IPCliente" value=""/>';
			form += '<input type="hidden" name="CustPermID" value="' + rut + '"/>';
			form += '<input type="hidden" name="CustLoginID" value="' + rut + '"/>';
			form += '<input type="hidden" name="SignonPswd" value="' + clave + '"/>';
			form += '<input type="hidden" name="destinoLoginPopupContexto" value="ABONAR-CONSUMO"/>';
			form += '</form>';
			jQuery(form).appendTo('body').submit();
		}
	}

	function showModalLogin(data, saltarFunction, loginFunction) {

		$("#rut").text($("#lb_rut").val());

		$('#saltarLogin').off('click').click(function() {
			$.modal.close();
			if (typeof saltarFunction == "function") {
				saltarFunction();
			}
		});

		$('#accesoLogin').off('click').click(function() {
			if (typeof loginFunction == "function") {
				loginFunction();
			}
		});

		showModalDefecto();

		$('#modal-formulario-login').modal();
		setTimeout(function() {
			animation_scroll("#step_two"),500
		});

	}

	function showModalReingreso(data, yesFunction, noFunction) {

		var time = new Date(data[0].fechaRechazo);

		$('#reingreso_fecha').text(time.getUTCDate() + "/" + (parseInt(time.getUTCMonth()) + 1) + "/" + time.getUTCFullYear());

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

		setTimeout(function() {
			animation_scroll("#step_one"),500
		});
	}

	function validaReingreso(data, nextStepFunction) {

		$.ajax({
			type : "POST",
			url : "/FUBBVAform/reingreso",
			data : {
				rut : data.rut,
				productos : data.productos.join(","),
				origen : ORIGEN_FORM_UNICO
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

	window.validaReingreso = validaReingreso;

	function enviarSolicitud(data, nextStepFunction) {
		// $.ajax({
		// 	type : "POST",
		// 	url : "/FUBBVAform/doForm",
		// 	data : {
		// 		rut : data.rut,
		// 		nombre : data.nombre,
		// 		telefono : data.telefono,
		// 		correo : data.email,
		// 		region : data.region,
		// 		comuna : data.comuna,
		// 		emailRobot : data.emailRobot,
		// 		codigoProducto : data.productos.join(","),
		// 		origen : ORIGEN_FORM_UNICO,
		// 		// Datos Universitario
		// 		universidad : data.universidad,
		// 		carrera : data.carrera,
		// 		anioCarrera : data.anioCarrera
		// 	},
		// 	dataType : "json",
		// 	success : function(data) {
		// 		if (data.ok) {
		// 			var idNotif = data.idNotif;
		// 			if (dataSimuladores.simulacionConsumo && dataSimuladores.simulacionHipotecario) {
		// 				enviarSimuladores(dataSimuladores.ajaxConsumo, idNotif);
		// 				enviarSimuladores(dataSimuladores.ajaxHipotecario, idNotif);
		// 			} else if (dataSimuladores.simulacionConsumo) {
		// 				enviarSimuladores(dataSimuladores.ajaxConsumo, idNotif);
		// 			} else if (dataSimuladores.simulacionHipotecario) {
		// 				enviarSimuladores(dataSimuladores.ajaxHipotecario, idNotif);
		// 			}
		// 		}
		// 		nextStepFunction();
		// 	},
		// 	error : function(xhr, textStatus, errorThrown) {
		// 		console.log("*** ERROR EN NOTIFICACION ***");
		// 		$(".formcontent").hide();
		// 		$("#solicitudError").fadeIn("fast");
		// 		animation_scroll("#solicitudError");
		// 	}
		// });
	}

	function getArrayProductos(productos) {

		var array = [];

		consumoIsChecked    = false;
		hipotecarioIsChecked= false;
		beneficiosIsChecked = false;

		//Validacion productos seleccionados formulario unico
		$(productos).each(function() {

			array.push($(this).val());
			if ($(this).data("simulador") == "consumo") {

				consumoIsChecked = true;

			} else if ($(this).data("simulador") == "hipotecario") {

				hipotecarioIsChecked = true;

			} else if ($(this).data("simulador") == "beneficios") {

				beneficiosIsChecked = true;

			}

		});

		return array;

	}

	function getProductosData(productos) {
		var prods = {};
		$(productos).each(function() {
			prods[$(this).val()] = $(this).data();
		});
		return prods;
	}

	/* --- PASO 0 --- */

	$("#clave").focus(function() {
		clearFieldError(this);
	});

	$("#clave").blur(function() {
		clearFieldError(this);
	});

	//Solicitud de cambio de clave
	$("#claveActual").focus(function() {
		clearFieldError(this);
		clearErrorActualizacionClaveAcceso();
	});

	$("#claveActual").blur(function() {
		validatePasswordField("#claveActual","Ingresa tu clave actual de acceso");
		toggleConfirmarCambioClaveAcceso();
	});

	$("#claveNueva1").focus(function() {
		clearFieldError(this);
		clearErrorActualizacionClaveAcceso();
	});

	$("#claveNueva1").blur(function() {
		validatePasswordField("#claveNueva1","Ingrese tu nueva clave de acceso");
		toggleConfirmarCambioClaveAcceso();
	});

	$("#claveNueva2").focus(function() {
		clearFieldError(this);
		clearErrorActualizacionClaveAcceso();
	});

	$("#claveNueva2").blur(function() {
		validatePasswordField("#claveNueva2","Repite tu nueva clave de acceso");
		toggleConfirmarCambioClaveAcceso();
	});

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

	//Inicio Integracion BBVA Cloud - Campo rut modal acceso cloud
	$("#rutAcceso").focus(function() {
		clearFieldError(this);
		clearLoginError();
	});

	$("#rutAcceso").blur(function() {
		validateRutField(this);
		clearLoginError();
		toggleIngresarAccesoBBVACloud();
	});

	$("#rutAcceso").keypress(function(event) {
		clearLoginError();
		if (!isMinControlChar(event.which) && !isRutChar(event.which)) {
			event.preventDefault();
		}
	});

	$("#rutAcceso").keyup(function(event) {
		clearLoginError();
		var rut = $(this).val();
		var format = formatRut(rut);
		$(this).val(format);
	});

	$("#pwdAcceso").focus(function() {
		clearFieldError(this);
		clearLoginError();
	});

	$("#pwdAcceso").blur(function() {
		validatePasswordField("#pwdAcceso","Ingresa tu código BBVA Cloud");
		clearLoginError();
		toggleIngresarAccesoBBVACloud();
	});

	$("#pwdAcceso").off('keypress').on('keypress',function(event){
		clearLoginError();
		this.value = this.value.replace(/[^a-zA-Z\s\d]/g,'');
	});

	//Termino Integracion BBVA Cloud - Campo rut modal acceso cloud

	// Activa el siguiente paso
	$("#next_zero").click(function() {

		validateNameFiled("#lb_name1");
		validateRutField("#lb_rut");

		$("#lb_name1").val(formatAccent($("#lb_name1").val()));

		formatName("#lb_name1");
		$("#lb_rut").val(formatRut($("#lb_rut").val()));
		if (hasInvalidFields(".campos-inicio")) {
			return;
		}

		$("#next_zero").addClass("button_disable").attr("disabled", true);

		// Pinta el nombre ingresado con formato requerido
		pintarNombre();

		//Inicio integracion cloud
		var nombre = $("#lb_name1").val();

		BBVACloud.cliente.nombreCompleto = nombre;
		if(nombre.indexOf(' ')>-1){
			BBVACloud.cliente.nombres	= nombre.substring(0,nombre.indexOf(' '));
			BBVACloud.cliente.apellidos	= nombre.substring(nombre.indexOf(' ')+1,nombre.length);

		}else{
			BBVACloud.cliente.nombres	= $("#lb_name1").val();
			BBVACloud.cliente.apellidos	= '';
		}

		BBVACloud.cliente.rut		= $("#lb_rut").val().replace(/\./g,'');

		//Informacion relevante seccion datos complementarios
		$("#dc_nombre").val(BBVACloud.cliente.nombres);
		$("#dc_apellidos").val(BBVACloud.cliente.apellidos);

		// Obtiene y pinta los productos
		getFormData($("#lb_rut").val(), $("#lb_name1").val());

	});

	function beginForProduct() {
		pintarProductos(dataSimuladores.dataForm);

		// Obtiene y pinta las ofertas
		getOfertas();

		var productosForm = dataSimuladores.dataForm.formulario.productosForm;
		if (dataSimuladores.dataForm.formulario.nombreCorto == "CONVENIO") {
			$("#divConvenio").show();
			$("#tipoContrato").selectmenu().selectmenu('refresh', true);
			dataSimuladores.isConvenio = true;
			productosForm = [];
		} else if (dataSimuladores.dataForm.formulario.nombreCorto == "PLANCCJ") {
			isPlanCtaJoven = true;
			getUniversidad("#universidad");
			$("#divUniversidad").show();
			$("#universidad").selectmenu().selectmenu('refresh', true);
			$("#carrera").selectmenu().selectmenu('refresh', true);
			$("#añoCarrera").selectmenu().selectmenu('refresh', true);
			dataSimuladores.isUniversitario = true;
			dataSimuladores.isInterest = false;
		}

		$.each(productosForm, function(index) {
			if (productosForm[index].premarcar && dataSimuladores.dataForm.formulario.productosForm.length == 1) {
				switch (productosForm[index].producto.simulador) {
					case 'beneficios':
						beneficiosIsChecked = true;
						onlyBeneficios = true;
						beginAction(dataSimuladores.dataForm.simuladores[productosForm[index].idProducto], ".simulaBeneficios");
						break;
					case 'consumo':
						consumoIsChecked = true;
						onlyConsumo = true;
						beginAction(dataSimuladores.dataForm.simuladores[productosForm[index].idProducto], ".simulaConsumo");
						break;
					case 'hipotecario':
						hipotecarioIsChecked = true;
						onlyHipotecario = true;
						beginAction(dataSimuladores.dataForm.simuladores[productosForm[index].idProducto], ".simulaHipotecario");
						break;
					// case '013':
					// break;
				}
			}

		});

		if (dataSimuladores.isInterest) {
			$("#step_one").fadeIn("fast");
			animation_scroll("#step_one");
			$("#facade").find('.blocked_disabled').css("z-index", "1");
			$("#step_one").find('.blocked_disabled').css("z-index", "-1");
			$(this).addClass("button_disable").attr("disabled", "true");
		}

	}

	function beginAction(url, simulName) {
		dataSimuladores.isInterest = false;
		dataSimuladores.urlIframeSimulador = url;
		logicaSimuladores();
		$(simulName).click();
	}

	/* --- PASO 1 --- */
	$("#next_one").click(function() {		// Btn Continuar, Seleccion de producto (activa el siguiente paso)

		//Inicio integracion cloud
		log('::Inicio integracion cloud(fu.js) inicia consulta esProductoCloud');
		esProductoCloud(getProductosSeleccionados(), validaBases, { rut : $("#lb_rut").val(), productos : getArrayProductos(".itemActivo .checkProducto") }, logicaSimuladores);

	});

	/* --- PASO 2 --- */
	$("#next_two").click(function() {		// Btn Simulacion, Saltar Simulacion. (activa el siguiente paso)

		//Inicializacion Toolip yeti
		$("#s3km8g-tooltip").html('<ul><li>Cloud es un servicio que te permite intercambiar documentos y así agilizar tus solicitudes.</li><li>Sube los documentos requeridos para tu solicitud a BBVA Cloud de manera rápida, fácil y segura.</li></ul>');
		$("#step_three").fadeIn("fast");
		inicializaSelectorRegion();

		//Valores ahora obtenidos desde codigos consolidadios Condor
		//getRegiones("#region");
		//getComunas("#region", "#comuna");
		//enableSendRequest();

		$("#step_two").find('.blocked_disabled').css("z-index", "1");
		$("#step_three").find('.blocked_disabled').css("z-index", "-1");

		$(this).addClass("button_disable").attr("disabled", "true");

		//shiftTo('step_three');
		shiftTo('step_two');

	});

	/* --- PASO 3 --- */
	$("#lb_phone").focus(function() {
		clearFieldError(this);
	});

	$("#lb_phone").blur(function() {
		validatePhoneField(this);
	});

	$("#lb_phone").keypress(function(event) {
		if (!isMinControlChar(event.which) && !isNumberChar(event.which)) {
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

	// Codigos consolidados cargados desde Condor
	// Comunas y regiones
	$("#region").selectmenu({
		change : function(event, ui) {
			validateRegionField("#region-button");
			actualizaSelectorComuna($("#region").val());
		}
	});

	$("#region").selectmenu({
		focus : function(event, ui) {
			clearFieldErrorMenu("#region-button");
		}
	});

	//SelectMenu Tipo direccion
	/*
	$("#ui-id-1").selectmenu({
		change : function(event, ui) {
			validateTipoDirectField("#ui-id-1-button");
		}
	});
	$("#ui-id-1").selectmenu({
		focus : function(event, ui) {
			clearFieldErrorMenu("#ui-id-1-button");
		}
	});
	*/

	//Select menu Nacionalidad
	$("#lb_nacionalidad").selectmenu({
		change : function(event, ui) {
			validateNacionalidadField("#lb_nacionalidad-button");
		}
	});

	$("#lb_nacionalidad").selectmenu({
		focus : function(event, ui) {
			clearFieldErrorMenu("#lb_nacionalidad-button");
		}
	});

	//Select menu Estado civil
	$("#lb_civ_sta").selectmenu({
		change : function(event, ui) {
			validateEstadoCivilField("#lb_civ_sta-button");
		}
	});

	$("#lb_civ_sta").selectmenu({
		focus : function(event, ui) {
			clearFieldErrorMenu("#lb_civ_sta-button");
		}
	});

	$("#comuna").selectmenu({
		change : function(event, ui) {
			validateComunaField("#comuna-button");
			enableSendRequest();
		}
	});

	$("#comuna").selectmenu({
		focus : function(event, ui) {
			clearFieldErrorMenu("#comuna-button");
		}
	});

	//Apellidos*
	$("#dc_apellidos").focus(function() {
		clearFieldError(this);
	});

	$("#dc_apellidos").blur(function() {
		//validateMiddleLastNameField(this);
		validateCompundLastNameField("#dc_apellidos");
	});

	//Calle*
	$("#dc_calle").focus(function() {
		clearFieldError(this);
	});

	$("#dc_calle").blur(function() {
		validateAddressFiled(this,'Ingresa el nombre de tu calle');
	});

	//Calle N°*
	$("#dc_calle_numero").focus(function() {
		clearFieldError(this);
	});

	$("#dc_calle_numero").blur(function() {
		validateAddressFiled(this,'Ingresa el número');
	});

	/*
	Tipo direccion
	$("#tipo_numero").focus(function() {
		clearFieldError(this);
	});

	Numero asociado al tipo de direccion
	$("#tipo_numero").blur(function() {
		validateAddressFiled(this);
	});
	*/

	//Comportamiento agregado a peticion de QA, salto al detectar longitud necesaria
	$('#fnac_dd').keyup(function(event){ if($(this).val().length == 2){ $('#fnac_mm').focus(); }});
	$('#fnac_mm').keyup(function(event){ if($(this).val().length == 2){ $('#fnac_aaaa').focus(); }});

	/*******************************************************/

	$("#universidad").selectmenu({
		change : function(event, ui) {
			validateUniversidadField("#universidad-button");
			getCarrera("#universidad", "#carrera");
			enableSendRequest();
		}
	});

	$("#carrera").selectmenu({
		change : function(event, ui) {
			validateCarreraField("#carrera-button");
			enableSendRequest();
		}
	});

	$("#añoCarrera").selectmenu({
		change : function(event, ui) {
			validateYearField("#añoCarrera-button");
			enableSendRequest();
		}
	});

	$("#universidad").selectmenu({
		focus : function(event, ui) {
			clearFieldErrorMenu("#universidad-button");
		}
	});

	$("#carrera").selectmenu({
		focus : function(event, ui) {
			clearFieldErrorMenu("#carrera-button");
		}
	});

	$("#añoCarrera").selectmenu({
		focus : function(event, ui) {
			clearFieldErrorMenu("#añoCarrera-button");
		}
	});

	// Formulario Unico - enviar solicitud
	$("#enviarSolicitud").click(function() {

		validatePhoneField("#lb_phone");
		validateEmailField("#field-email");
		validateRegionField("#region-button");
		validateComunaField("#comuna-button");

					var awHazteCliente = false;
					var awConsumo = false;
					var awHipotecario = false;
					$(".itemActivo .checkProducto").each(function() {
						if ($(this).data("simulador") == "consumo") {
							awConsumo = true;
						} else if ($(this).data("simulador") == "hipotecario") {
							awHipotecario = true;
						} else {
							awHazteCliente = true;
						}
					});
					if (awHazteCliente) {
						$("#iframeAw1").attr("src", "fu/aw/HazteCliente.html");
					}
					if (awConsumo) {
						$("#iframeAw2").attr("src", "fu/aw/Consumo.html");
					}
					if (awHipotecario) {
						$("#iframeAw3").attr("src", "fu/aw/Hipotecario.html");
					}
				});


		if (isPlanCtaJoven) {
			validateUniversidadField("#universidad-button");
			validateCarreraField("#carrera-button");
			validateYearField("#añoCarrera-button");
		}

		if (hasInvalidFields("#step_three") || $("#region").val() === "" || $("#comuna").val() === "") {
			return;
		}

		if (isPlanCtaJoven) {
			if (hasInvalidFields("#step_three") || $("#universidad").val() === "" || $("#carrera").val() === "" || $("#añoCarrera").val() === ""){
				return;
			}
		}

		$("#enviarSolicitud").addClass("button_disable").attr("disabled", true);

		enviarSolicitud({
			rut : $("#lb_rut").val(),
			nombre : $("#lb_name1").val(),
			telefono : $("#lb_phone").val(),
			email : $("#field-email").val(),
			region : $("#region").val(),
			comuna : $("#comuna").val(),
			emailRobot : $("#emailRobot").val(),
			productos : getArrayProductos(".itemActivo .checkProducto"),
			universidad : (isPlanCtaJoven) ? $("#universidad").val() : "0",
			carrera : (isPlanCtaJoven) ? $("#carrera").val() : "0",
			anioCarrera : (isPlanCtaJoven) ? $("#añoCarrera").val() : "0"
		}, function() {
			$(".formcontent").hide();
			$("#solicitudEnviada").fadeIn("fast");
			animation_scroll("#solicitudEnviada");

			var awHazteCliente = false;
			var awConsumo = false;
			var awHipotecario = false;
			$(".itemActivo .checkProducto").each(function() {
				if ($(this).data("simulador") == "consumo") {
					awConsumo = true;
				} else if ($(this).data("simulador") == "hipotecario") {
					awHipotecario = true;
				} else {
					awHazteCliente = true;
				}
			});
			if (awHazteCliente) {
				$("#iframeAw1").attr("src", "aw/HazteCliente.html");
			}
			if (awConsumo) {
				$("#iframeAw2").attr("src", "aw/Consumo.html");
			}
			if (awHipotecario) {
				$("#iframeAw3").attr("src", "aw/Hipotecario.html");
			}
		});

	});



function logicaSimuladores() {

	if (consumoIsChecked && hipotecarioIsChecked && beneficiosIsChecked || consumoIsChecked && hipotecarioIsChecked) {
		howToShowSimuladores("¿Te gustaría simular tu Crédito?", "#btnSimuladorConsumo", "#lstConsumo", "#btnSimuladorHipotecario", "#lstHipotecario");
		mostrarSimuladores();
	} else if (consumoIsChecked && beneficiosIsChecked) {
		howToShowSimuladores("¿Te gustaría simular estos productos?", "#btnSimuladorBeneficios", "#btnSimuladorConsumo", "#lstBeneficios", "#lstConsumo");
		mostrarSimuladores();
	} else if (hipotecarioIsChecked && beneficiosIsChecked) {
		howToShowSimuladores("¿Te gustaría simular estos productos?", "#btnSimuladorBeneficios", "#btnSimuladorHipotecario", "#lstBeneficios", "#lstHipotecario");
		mostrarSimuladores();
	} else if (consumoIsChecked) {
		howToShowSimuladores("¿Te gustaría ir a simular tu Crédito?", "#btnSimuladorConsumo", "#lstConsumo", "", "");
		mostrarSimuladores();
		$("#btnSimuladorConsumo").removeClass("small-12 medium-6 large-4");
		$("#btnSimuladorConsumo").addClass("medium-12");
		$("#btnSimuladorConsumoDisabled").removeClass("small-12 medium-6 large-4");
		$("#btnSimuladorConsumoDisabled").addClass("medium-12");
		$('#lineaEntremedia').hide();
	} else if (hipotecarioIsChecked) {
		howToShowSimuladores("¿Te gustaría ir a simular tu Crédito?", "#btnSimuladorHipotecario", "#lstHipotecario", "", "");
		mostrarSimuladores();
		$("#btnSimuladorHipotecario").removeClass("small-12 medium-6 large-4");
		$("#btnSimuladorHipotecario").addClass("medium-12");
		$("#btnSimuladorHipotecarioDisabled").removeClass("small-12 medium-6 large-4");
		$("#btnSimuladorHipotecarioDisabled").addClass("medium-12");
		$('#lineaEntremedia').hide();
	} else if (beneficiosIsChecked) {
		howToShowSimuladores("descubre los beneficios de cuenta corriente BBVA, ¿Quieres saber cuánto puedes ahorrar?", "#btnSimuladorBeneficios", "#lstBeneficios", "", "");
		mostrarSimuladores();
		$("#btnSimuladorBeneficios").removeClass("small-12 medium-6 large-4");
		$("#btnSimuladorBeneficios").addClass("medium-12");
		$("#btnSimuladorBeneficiosDisabled").removeClass("small-12 medium-6 large-4");
		$("#btnSimuladorBeneficiosDisabled").addClass("medium-12");
		$('#lineaEntremedia').hide();
	} else {
		$("#next_two").click();
		$("#step_one").find('.blocked_disabled').css("z-index", "1");
	}

	//shiftTo('step_two');
	shiftTo('step_one');

}

function howToShowSimuladores(texts, btnShow, lstShow, secondBtnShow, secondLstShow) {

	$(".titulo-simuladores").text(texts);
	$(btnShow).show();
	$(lstShow).show();
	if (secondBtnShow != "" && secondLstShow != "") {
		$(secondBtnShow).show();
		$(secondLstShow).show();
	}

}

function mostrarSimuladores() {

	$("#step_two").fadeIn("fast");
	animation_scroll("#step_two");
	$("#step_two").find('.blocked_disabled').css("z-index", "-1");
	$(this).addClass("button_disable").attr("disabled", "true");
	if (!dataSimuladores.isInterest){
		$("#facade").find('.blocked_disabled').css("z-index", "1");
	}else{
		$("#step_one").find('.blocked_disabled').css("z-index", "1");
	}

}

function beneficios() {

	$("#simConsumoIframe").empty();
	var url = (onlyBeneficios) ? dataSimuladores.urlIframeSimulador : dataSimuladores.dataForm.simuladores[dataSimuladores.dataForm.formulario.productosForm[0].idProducto]

	var iframe = $('<iframe></iframe>');
	iframe.attr("id", "iframeSim");
	iframe.attr("src", url);
	iframe.attr("width", "100%");
	iframe.attr("height", "650px");
	iframe.attr("scrolling", "no");
	iframe.attr("frameborder", "0");
	iframe.attr("style", "min-width: 100%; width: 100px; *width: 100%");

	$("#simConsumoIframe").append(iframe);

	iframe.submit();
	iFrameResize({
		enablePublicMethods : true,
		heightCalculationMethod : 'grow'
	});
}

$(".simulaBeneficios").click(function() {
	validadorBeneficios = true;
	$("#home-simuladores").hide();
	beneficios();
	$("#iframeSim").fadeIn("fast");
	$("#simConsumoIframe").fadeIn("fast");
	animation_scroll("#step_two");
});

function consumo() {
	$("#simConsumoIframe").empty();
	// $('#formulario', window.parent.document).height('2300px');
	var url = (onlyConsumo) ? dataSimuladores.urlIframeSimulador : dataSimuladores.dataForm.simuladores[dataSimuladores.dataForm.formulario.productosForm[1].idProducto]

	var iframe = $('<iframe></iframe>');
	iframe.attr("id", "iframeSim");
	iframe.attr("src", url);
	iframe.attr("width", "100%");
	iframe.attr("height", "650px");
	iframe.attr("scrolling", "no");
	iframe.attr("frameborder", "0");
	iframe.attr("style", "min-width: 100%; width: 100px; *width: 100%");
	$("#simConsumoIframe").append(iframe);

	iframe.submit();
	iFrameResize({
		enablePublicMethods : true,
		heightCalculationMethod : 'grow'
	});
}

$(".simulaConsumo").click(function() {
	validadorConsumo = true;
	$("#home-simuladores").hide();
	consumo();
	$("#iframeSim").fadeIn("fast");
	$("#simConsumoIframe").fadeIn("fast");

	animation_scroll("#step_two");
});

function hipotecario() {
	$("#simConsumoIframe").empty();
	// $('#formulario', window.parent.document).height('2700px');
	var url = (onlyHipotecario) ? dataSimuladores.urlIframeSimulador : dataSimuladores.dataForm.simuladores[dataSimuladores.dataForm.formulario.productosForm[2].idProducto]

	var iframe = $('<iframe></iframe>');
	iframe.attr("id", "iframeSim");
	iframe.attr("src", url);
	iframe.attr("width", "100%");
	iframe.attr("height", "650px");
	iframe.attr("scrolling", "no");
	iframe.attr("frameborder", "0");
	iframe.attr("style", "min-width: 100%; width: 100px; *width: 100%");

	$("#simConsumoIframe").append(iframe);

	iframe.submit();
	iFrameResize({
		enablePublicMethods : true,
		heightCalculationMethod : 'grow'
	});
}

$(".simulaHipotecario").click(function() {

	validadorHipotecario = true;
	$("#home-simuladores").hide();
	hipotecario();
	$("#iframeSim").fadeIn("fast");
	$("#simConsumoIframe").fadeIn("fast");
	animation_scroll("#step_two");

});

$("#validadorCreditos").click(function() {

	if (consumoIsChecked && hipotecarioIsChecked && beneficiosIsChecked || consumoIsChecked && hipotecarioIsChecked) {

		if (validadorConsumo && validadorHipotecario) {
			transitionFu("#btnSimuladorConsumo", "#btnSimuladorConsumoDisabled", "#btnSimuladorHipotecario", "#btnSimuladorHipotecarioDisabled");
		} else if (validadorConsumo && !validadorHipotecario) {
			finishSimulation("#btnSimuladorConsumo", "#btnSimuladorConsumoDisabled", true);
		} else if (!validadorConsumo && validadorHipotecario) {
			finishSimulation("#btnSimuladorHipotecario", "#btnSimuladorHipotecarioDisabled", true);
		}

	} else if (consumoIsChecked && beneficiosIsChecked) {

		if (validadorConsumo && validadorBeneficios) {
			transitionFu("#btnSimuladorConsumo", "#btnSimuladorConsumoDisabled", "#btnSimuladorBeneficios", "#btnSimuladorBeneficiosDisabled");
		} else if (validadorConsumo && !validadorBeneficios) {
			finishSimulation("#btnSimuladorConsumo", "#btnSimuladorConsumoDisabled", true);
		} else if (!validadorConsumo && validadorBeneficios) {
			finishSimulation("#btnSimuladorBeneficios", "#btnSimuladorBeneficiosDisabled", true);
		}

	} else if (hipotecarioIsChecked && beneficiosIsChecked) {
		if (validadorHipotecario && validadorBeneficios) {
			transitionFu("#btnSimuladorHipotecario", "#btnSimuladorHipotecarioDisabled", "#btnSimuladorBeneficios", "#btnSimuladorBeneficiosDisabled");
		} else if (validadorHipotecario && !validadorBeneficios) {
			finishSimulation("#btnSimuladorHipotecario", "#btnSimuladorHipotecarioDisabled", true);
		} else if (!validadorHipotecario && validadorBeneficios) {
			finishSimulation("#btnSimuladorBeneficios", "#btnSimuladorBeneficiosDisabled", true);
		}

	} else {
		if (validadorConsumo) {
			finishSimulation("#btnSimuladorConsumo", "#btnSimuladorConsumoDisabled", false);

		} else if (validadorHipotecario) {
			finishSimulation("#btnSimuladorHipotecario", "#btnSimuladorHipotecarioDisabled", false);

		} else if (validadorBeneficios) {
			finishSimulation("#btnSimuladorBeneficios", "#btnSimuladorBeneficiosDisabled", false);

		}
		$("#next_two").click();
	}

});

function transitionFu(btn1, btn2, btn3, btn4) {
	$("#next_two").click();
	$("#iframeSim").hide();
	$("#simConsumoIframe").hide();
	$("#home-simuladores").show();
	$(btn1).hide();
	$(btn2).show();
	$(btn3).hide();
	$(btn4).show();
}

function finishSimulation(incon1, incon2, resize) {
	$("#home-simuladores").show();
	$(incon1).hide();
	$(incon2).show();
	if (resize) {
		animation_scroll("#step_two");
	}
}

window.addEventListener("message", function(event) {
	switch (event.data.id) {
		case "continuar":
			transitionListener();
			break;
		case "saltar":
			transitionListener();
			break;
		case "consumo":
			dataSimuladores.urlConsumo = event.data.url;
			dataSimuladores.ajaxConsumo = event.data.data;
			dataSimuladores.simulacionConsumo = event.data.simulacion;
			transitionListener();
			break;
		case 'hipotecario':
			dataSimuladores.urlHipotecario = event.data.url;
			dataSimuladores.ajaxHipotecario = event.data.data;
			dataSimuladores.simulacionHipotecario = event.data.simulacion;
			transitionListener();
			break;
	}
});

function transitionListener() {
	$("#simConsumoIframe").hide();
	$("#validadorCreditos").click();
}

function enviarSimuladores(dataSimulador, idNotif) {

	dataSimulador = dataSimulador + '"celular":"' + $("#lb_phone").val() + '","ciudad":"' + $("#region").val() + '|'
			+ $("#comuna").val() + '","email":"' + $("#field-email").val() + '","region":"' + $("#region").val()
			+ '","fonoParticular":"' + $("#lb_phone").val() + '","idNotif":"' + idNotif + '"' + '}';

	$.ajax({
		cache : false,
		type : "POST",
		url : "/FUBBVAform/SimulFormServlet",
		data : {
			myJson : dataSimulador
		},
		dataType : 'json',
		processdata : true,
		success : function(data) {
			//console.log("*** GUARDADO EXITOSO EN BD SIMULADORES ***");
		},
		error : function(xhr, textStatus, errorThrown) {
			//console.log("*** NO SE GUARDO EN BD SIMULADORES ***");
		}
	});

}

function enviarIngresoConsumo() {

	dataSimuladores.ajaxConsumo = dataSimuladores.ajaxConsumo + '"celular":"' + $("#lb_phone").val() + '","ciudad":"'
			+ $("#region").val() + '|' + $("#comuna").val() + '","email":"' + $("#field-email").val() + '","region":"'
			+ $("#region").val() + '","fonoParticular":"' + $("#lb_phone").val() + '"' + '}';

	$.ajax({
		cache : false,
		type : "POST",
		url : dataSimuladores.urlConsumo,
		data : dataSimuladores.ajaxConsumo,
		contentType : 'application/json; charset=utf-8',
		dataType : 'json',
		processdata : true,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('Authorization', make_base_auth('marco', 'marco'));
		},
		success : function(data) {
			console.log("1916 data.success" + data.success);
		},
		error : function(xhr, textStatus, errorThrown) {
		}
	});
}

function enviarIngresoHipotecario() {

	dataSimuladores.ajaxHipotecario = dataSimuladores.ajaxHipotecario + '"celular":"' + $("#lb_phone").val()
			+ '","ciudad":"' + $("#region").val() + '|' + $("#comuna").val() + '","email":"' + $("#field-email").val()
			+ '","region":"' + $("#region").val() + '","fonoParticular":"' + $("#lb_phone").val() + '"' + '}';

	$.ajax({
		cache : false,
		type : "POST",
		url : dataSimuladores.urlHipotecario,
		data : dataSimuladores.ajaxHipotecario,
		contentType : 'application/json; charset=utf-8',
		dataType : 'json',
		processdata : true,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('Authorization', make_base_auth('marco', 'marco'));
		},
		success : function(data) {
			// esto debe retornar true, se cumple la sgte
			// tarea q es ingreso de datos, y luego la tarea
			// ingreso de email
			console.log("3475 data.success " + data.success);
		},
		error : function(xhr, textStatus, errorThrown) {
		}
	});
}

function enableNextZero() {
	if (!validateNameFiled("#lb_name1") || !validateRutField("#lb_rut")) {
		$("#next_zero").addClass("button_disable").attr("disabled", "disabled");
	} else {
		$("#next_zero").removeClass("button_disable").removeAttr("disabled");
	}
}

function enableSendRequest() {

	if (dataSimuladores.isUniversitario) {
		if ($("#lb_phone").val() == "" || $("#field-email").val() == "" || $("#region").val() == "" || $("#comuna").val() == "" || $("#universidad").val() == "" || $("#carrera").val() == "" || $("#añoCarrera").val() == "") {
			// $("#enviarSolicitud").addClass("button_disable").attr("disabled", true);
		} else {
			// $("#enviarSolicitud").removeClass("button_disable").removeAttr("disabled", false);
		}
	} else if (dataSimuladores.isConvenio) {
		if ($("#lb_phone").val() == "" || $("#field-email").val() == "" || $("#region").val() == "" || $("#comuna").val() == "" || $("#fechaIngresoEmpresa").val() == "" || $("#tipoContrato").val() == "" || $("#codConvenio").val() == "") {
			// $("#enviarSolicitud").addClass("button_disable").attr("disabled", true);
		} else {
			// $("#enviarSolicitud").removeClass("button_disable").removeAttr("disabled", false);
		}
	} else {
		if ($("#lb_phone").val() == "" || $("#field-email").val() == "" || $("#region").val() == "" || $("#comuna").val() == "") {
			// $("#enviarSolicitud").addClass("button_disable").attr("disabled", true);
		} else {
			// $("#enviarSolicitud").removeClass("button_disable").removeAttr("disabled", false);
		}
	}

}

function formatName(name) {
	var format = $(name).val().replace(/[^a-zA-Z\s]+/g, "");
	$(name).val(format);
}

function formatAccent(s) {

	var out = '';

	for (var i = 0; i < s.length; i++) {
		var c = s[i];
		switch (c) {
			case "Á":
				part = 'A';
				break;// Á
			case "á":
				part = 'a';
				break;// á
			case "É":
				part = 'E';
				break;// É
			case "é":
				part = 'e';
				break;// é
			case "Í":
				part = 'I';
				break;// Í
			case "í":
				part = 'i';
				break;// í
			case "Ó":
				part = 'O';
				break;// Ó
			case "ó":
				part = 'o';
				break;// ó
			case "Ú":
				part = 'U';
				break;// Ú
			case "ú":
				part = 'u';
				break;// ú
			case "Ü":
				part = 'u';
				break;// Ü
			case "ü":
				part = 'u';
				break;// ü
			case "Ñ":
				part = 'N';
				break;// Ṅ
			case "ñ":
				part = 'n';
				break;// ñ
			default:
				part = c;
		}
		out += part;
	}

	return out;
}

function make_base_auth(user, password) {
	var tok = user + ':' + password;
	var hash = btoa(tok);
	return "Basic " + hash;
}

function getCarrera(universidad, carrera) {
	var id = $(universidad).val();
	var $carrera = $(carrera);
	$carrera.empty();
	$carrera.append('<option value="">Selecciona una Carrera</option>');
	$carrera.selectmenu("refresh");
	if (id !== '') {
		$.ajax({
			cache : false,
			type : "POST",
			url : "/FUBBVAform/getUnivCarrera",
			data : {
				type : "cu",
				idUniv : id
			},
			dataType : 'json',
			processdata : true,
			success : function(data) {
				$.each(data, function(index) {
					$carrera.append('<option value="' + data[index].codCarrera + '">' + data[index].descCarrera + '</option>');
				});
				$carrera.selectmenu("refresh");
			},
			error : function(xhr, textStatus, errorThrown) {
			}
		});
	}

}

function animation_scroll(step) {
	// var data = {
	// 	'id'		: 'animate',
	// 	'step'		: {scrollTop : $(step).offset().top},
	// };
	// top.postMessage(data, "*");
}

function getUniversidad(universidad) {

	var $universidad = $(universidad);
	$universidad.empty();
	$universidad.append('<option value="">Selecciona una Universidad</option>');
	$universidad.selectmenu("refresh");
	$.ajax({
		type : "POST",
		url : "/FUBBVAform/getUnivCarrera",
		data : {
			type : "u"
		},
		dataType : "json",
		success : function(data) {
			$.each(data, function(index) {
				$universidad.append('<option value="' + data[index].codUniversidad + '">' + data[index].desUniversidad
						+ '</option>');
			});
			$universidad.selectmenu("refresh");
		},
		error : function(xhr, textStatus, errorThrown) {
			// alert(xhr.responseText + " " + errorThrown);
		}
	});

}
