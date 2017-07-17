/******************************************************************
 Funcionalidades utilizadas en Hazte cliente cloud
******************************************************************/
var BBVACloud = {
	forzarFormularioUnico               : false,
	pendientesCloud                     : [],
	productosDisponibles                : {},
	productosSeleccionados              : '',
	cliente                             : {
		nombres                         : '',
		apellidos                       : '',
		rut                             : ''
	},
	esClienteBBVA                       : {
		esCliente                       : '',
		tieneNotificaciones             : ''
	},
	notificaciones                      : [],
	ofertasCrecer                       : [],
	validaAccesoCloud                   : {
		estadoPeticion                  : ''
	},
	esProductoCloud                     : {
		esProductoCloud                 : ''
	},
	validaCedula                        : {
		serialNumber                    : '',
		dicomReportDate                 : '',
		dicomUserName                   : '',
		isIdentityCardActive            : '',
		blockingReason                  : '',
		blockingDate                    : '2020-02-22T12:00:00.000-0600',
		informationSource               : ''
	},
	validaBases                         : {
		estadoValidaciones              : ''
	},
	datosComplementarios                : {},
	enrollNewPerson                     : {
		estadoEnrolamiento              : false,
		listDigitalFolderChecklist      : {
			estadoGetChecklistNoCliente : false,
			digitalFolderChecklist		: []		//N-objetos { productRequestId: '012345678', checklists : [] }
		}
	},
	envioSms                            : {
		statusCode                      : '',
		statusDesc                      : ''
	},
	continuarSolicitud : {
		listDigitalFolderChecklist      : {
			estadoGetChecklistNoCliente : false,
			digitalFolderChecklist		: []
		}
	},
	responseUploadDocuments             : {
		estadoCarga                     : false,
		documentos                      : [
			{
				nomArchivo		        : '',
				codigoRespuesta	        : '',
				descripcionRespuesta    : ''
			}
		]
	},
	actualizacionClaveAcceso            : {},
	informacionCompiladaUploadDocuments : {}
}

function cerrarModalGenerica(){
	//Cierra la modal generica de error
	log('::Cierra la modal generica de error');
	$("#modalGenericaError .close-icon").click();

	location.href = "https://www.bbva.cl";

}

var enviaEventoCheckCloud = false;

/*
 @brief		Invoca transcicion al paso anterior al actual
*/
function prev(){
	transicionAnterior(fixSelector($('.section_main:visible').attr('id')));
}

/*
 @brief		Realiza la transicion en la interfaz desde el paso actual al paso anterior
*/
function transicionAnterior(contenedor){

	if($(contenedor).length == 0)
		return;

	if($(contenedor).prev('.section_main').length == 0)
		return;


	$(contenedor).find('.blocked_disabled').css("z-index", "1");
	$(contenedor).hide();

	$(contenedor).prev('.section_main').find('.blocked_disabled').css("z-index", "-1");
	$(contenedor).prev('.section_main').slideDown("slow");

	if($(contenedor).prev('.section_main').find('.button_init .init_button, .btn-secondary').length  == 1)
		$(contenedor).prev('.section_main').find('.button_init .init_button, .btn-secondary').removeAttr('disabled').removeClass('button_disable');

	quitarCapaCarga();

}

/*
 @brief		Transicion entre contenedores
 @param		id contenedor al que se quiere realizar la transición
*/
function shiftTo(container){

	if($("#"+container).length == 1){
		$("#"+container).slideUp('fast');
	}else{
		//No fue especificado un contenedor valido para la transicion
		log('::shiftTo('+container+'):: No fue especificado un contenedor valido para la transicion');
	}

}

/*	@brief		Habilita/Deshabilita boton Ingresar Acceso BBVA Cloud - Login

*/
function toggleIngresarAccesoBBVACloud(){

	if(validateRutField("#rutAcceso") && validatePasswordField("#pwdAcceso","Ingrese su clave de acceso")){
		$("#btnIngresarAccesoBBVACloud").removeClass('button_disable').removeAttr('disabled');
	}else{
		$("#btnIngresarAccesoBBVACloud").addClass('button_disable').attr('disabled','disabled');
	}

}

/*	@brief		Habilita/Deshabilita boton Confirmar Acceso BBVA Cloud - Actualizacion de Clave de Acceso
*/
function toggleConfirmarCambioClaveAcceso(){

	if(validatePasswordField("#claveActual","Ingrese su clave de acceso actual") && validatePasswordField("#claveNueva1","Ingrese su clave de acceso") && validatePasswordField("#claveNueva2","Ingrese su clave de acceso")){
		$("#btnConfirmaActualizacionClave").removeClass('button_disable').removeAttr('disabled');
	}else{
		$("#btnConfirmaActualizacionClave").addClass('button_disable').attr('disabled','disabled');
	}

}

/*	@brief		Muestra/Oculta el bloque para actualizar clave de acceso

*/
function toggleSolicitudDeActualizacionClaveAcceso(){

	log('::toggleSolicitudDeActualizacionClaveAcceso:: init');

	setTimeout(function(){
		if($('#contenedor-acceso-cloud-principal').is(':visible')){
			$('#contenedor-acceso-cloud-principal').hide();
			$("#contenedor-acceso-cloud-cambio-clave").slideDown('slow');
		}else{
			$("#contenedor-acceso-cloud-cambio-clave").hide();
			$('#contenedor-acceso-cloud-principal').slideDown('slow');
		}
	},50);
}

/*
 @brief			Confirma una solicitud de cambio de clave de acceso luego de haber oncfirmado a traves de una operacion de login su obligatoriedad
*/
function confirmaActualizacionClaveAcceso(){

	log('::confirmaActualizacionClaveAcceso() init');
	
	if($('#claveNueva1').val().trim() === $('#claveNueva2').val().trim()){

		var data = {
			'solicitud'  : 'solicitudCambioClave',
			'rut'		 : $("#rutAcceso").val().replace(/\./g,''),
			'claveActual': $('#claveActual').val(),
			'claveNueva1': $('#claveNueva1').val(),
			'claveNueva2': $('#claveNueva2').val()
		};

		$.ajax({
			url     	: '/FUBBVAform/fuValidacion',
			type    	: 'post',
			dataType	: 'json',
			data    	: data,
			success		: function(json){

				BBVACloud.actualizacionClaveAcceso = json;

				if(typeof BBVACloud.actualizacionClaveAcceso != 'undefined' && BBVACloud.actualizacionClaveAcceso.estadoCambioClave == true){

					log('::confirmaActualizacionClaveAcceso:: Clave actualizada exitosamente');

					log('INICIA recuperaInformacionSubirDocumentos("' + getProductosPendientes(BBVACloud.pendientesCloud) + '")');
					recuperaInformacionSubirDocumentos(getProductosPendientes(BBVACloud.pendientesCloud));

				}else{
					log('::confirmaActualizacionClaveAcceso:: Error al intentar la actualizacion de clave de acceso.');
					errorActualizacionClaveAcceso('Error al intentar la actualizacion de clave de acceso.');
				}
			},
			error   : function(request, textStatus, thrownError){
				log('::confirmaActualizacionClaveAcceso:: Error al intentar recuperar la informacion de la solicitud.');
				errorActualizacionClaveAcceso('Error al intentar recuperar la informacion de la solicitud.');
			}
		});
	} else {
		log('::confirmaActualizacionClaveAcceso:: Los campos de clave nueva no coinciden.');
		errorActualizacionClaveAcceso('Los datos ingresados en los campos de nueva clave no coinciden.');
	}
}

/*@DEPRECATED
  @brief			Carga inline la url desde Condor para Actualizacion de clave de acceso
*/
function despliegaFrameActualizacionClave(rutAcceso, pwdAcceso){

	var srcAcceso = 'http://93.16.236.181:9081/bbvanet/Process?AID=LOGINCAMBIOCLAVE-0100&rutAcceso=' + rutAcceso + '&pwdAcceso=' + pwdAcceso;
	log('::despliegaFrameActualizacionClave srcAcceso: ' + srcAcceso);

	$("#iframeActualizacion").attr('src',srcAcceso);

	$("#contenedor-acceso-cloud-principal").hide();
	$("#contenedor-acceso-cloud-cambio-clave").hide();
	$("#contenedor-acceso-cloud-iframe .capacarga").show();
	$("#contenedor-acceso-cloud-iframe").slideDown();

}

/*
 @brief		Muestra mensaje error al detectar un problema con el nombre usuario/contraseña ingresadas por el usuario
*/
function despliegaBloqueErrorLogin(){
	if(!$('#acceso-bbva-error-login').is(':visible')){
		$("#acceso-bbva-error-login").slideDown('slow');
	}
}

/*	@brief		Despliega el bloque de error cuando no se ha podido realizar el cambio de clave de acceso.
	@param		Msg	String	Mensaje descriptivo con el error en el caso que no se quiera desplegar el error por defecto
	@default	'Ha ocurrido un error al intentar actualizar su clave de acceso, por favor intente más tarde'
*/
function errorActualizacionClaveAcceso(msg){

	log('::errorActualizacionClaveAcceso:: Despliega el mensaje de error, glosa informada(' + ((typeof msg != 'undefined' && msg != '') ? msg : '~') + ')');

	var eMsg = (typeof msg != 'undefined' && msg != '') ? msg : 'Ha ocurrido un error al intentar actualizar su clave de acceso, por favor intente más tarde';

	$("#contenedor-acceso-cloud-cambio-clave .error-description").text(eMsg);
	$("#contenedor-acceso-cloud-cambio-clave .error-container").slideDown('slow');
}

/*
 @brief		Oculta mensaje error al detectar un problema con el nombre usuario/contraseña ingresadas por el usuario
*/
function clearLoginError(){
	if($('#acceso-bbva-error-login').is(':visible')){
		$("#acceso-bbva-error-login").slideUp('slow');
	}
}

/*
 @brief		Despliega el bloque de error generico de formulario unico
*/
function errorSolicitud(descripcionError){

	$(".formcontent.container_fluid").hide();
	$("#solicitudError").show();

	if(typeof descripcionError != 'undefined' && descripcionError != ''){
		$("#solicitudError .descripcionError").text(descripcionError);
		$("#solicitudError .descripcionError").show();
	}

}

/*
 @brief			Obtiene los pendientes cloud asociados a un determinado rut
 @description	Recupera los pendientes cloud, y si es que tiene pendientes Cloud
				entonces intenta realizar un login
 @test
	obtenerPendientesCloud('15035142-1');
	obtenerPendientesCloud('1-9');
	obtenerPendientesCloud('13508984-2');
*/
function obtenerPendientesCloud(parametroConsulta,informacionComplementaria){

	var rutAcceso	= $("#rutAcceso").val().replace(/\./g,'');
	var passAcceso	= $("#pwdAcceso").val();

	//Parametro consulta de notificaciones y username para login
	if(typeof parametroConsulta != 'undefined' && parametroConsulta != ''){
		rutAcceso = parametroConsulta;
	}

	//Parametro para login
	if(typeof informacionComplementaria != 'undefined' && informacionComplementaria != ''){
		passAcceso = informacionComplementaria;
	}

	var data = {
		'solicitud' : 'getNotificacion',
		'rut'		: rutAcceso
	};

	BBVACloud.cliente.rut = $("#rutAcceso").val().replace(/\./g,'');

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

	$.ajax({
		url     	: '/FUBBVAform/fuValidacion',
		type    	: 'post',
		dataType	: 'json',
		data    	: data,
		success		: function(json){

			BBVACloud.pendientesCloud = json;

			if(typeof BBVACloud.pendientesCloud != 'undefined' && BBVACloud.pendientesCloud.length >0){
				//Con pendientes Cloud
				log('::obtenerPendientesCloud(' + rutAcceso + '):: Con pendientes Cloud');

				//Aqui encolar llamada login
				validaLoginAccesoCloud(rutAcceso,passAcceso);

			}else{
				//Sin pendientes CLoud
				log('::obtenerPendientesCloud(' + rutAcceso + '):: Sin pendientes CLoud');
				mostrarModalSinPendientes($("#lb_name1").val());
			}
		},
		error   : function(request, textStatus, thrownError){
			log('::obtenerPendientesCloud(' + rutAcceso + '):: Error al tratar de recuperar la respuesta. Respuesta no existe o sin el formato valido');
			log(request); log(textStatus); log(thrownError);
		}
	});
}

/*
 @brief			Continua el flujo para un cliente que poseee una notificacion Cloud con una solicitud pendiente
 @description	Cierra la modal de ir a completar y abre la modal de Acceso BBVA Cloud
*/
function btnCompletarSolicitudCompletar(){
	log('::btnCompletarSolicitudCompletar():: Redirecciona a Acceso BBVA Cloud(Modal)');
	$("#modal-completar-solicitud .close-modal ").click();
	mostrarModalAccesoBBVACloud();
}

/*
 @brief			Continua el flujo para un cliente que poseee una notificacion Cloud
 @description	Cierra la modal de ir a completar, marca el flujo relativo a formulario unico
*/
function btnCompletarSolicitudNueva(){
	//Marca el flujo como formulario unico y avanza al paso de seleccion de producto
	BBVACloud.forzarFormularioUnico = true;
	toggleInterfaceCloudFormularioUnico(false);
	$("#modal-completar-solicitud .close-modal").click();
	logicaSimuladores();
}

/*	@DEPRECATED
	@brief		Contextualiza en notificaciones la intencion del usuario de hacer click en el Check asociado a Cloud
*/
function checkCloud(checked){

	var data = {
		"solicitud"	: "checkCloud",
		"checked"	: checked ? "true" : "false"
	};

	$.ajax({
		url     : '/FUBBVAform/fuValidacion',
		type    : 'post',
		dataType: 'json',
		data    : data,
		success : function(json){
			log('::checkCloud('+checked+') actualizado con exito');
		},
		error   : function(request, textStatus, thrownError){
			log('::checkCloud('+checked+') error al intentar realizar proceso de actualizacion');
		}
	});
}

/*
 @brief			Determina si un cliente corresponde a un cliente BBVA
 @return		esClienteBBVA('15035142-1'); => {"esCliente":" ", "tieneNotificaciones":" "}
 @reference		BBVACloud.esClienteBBVA
*/
function esClienteBBVA(rutAcceso, nombreAcceso){

	log('::esClienteBBVA:: init(' + rutAcceso + ')');

	if(typeof rutAcceso != 'undefined' && rutAcceso != ''){

		var rutConsulta = rutAcceso.replace(/\./g,'');
		var data	= {
			"solicitud"		: "esCliente",
			"rut"			: rutAcceso,
			"nombreCompleto": nombreAcceso
		};

		$.ajax({
			url     : '/FUBBVAform/fuValidacion',
			type    : 'post',
			dataType: 'json',
			data    : data,
			success : function(json){

				BBVACloud.esClienteBBVA = json;

				//Agregada logica para identificar si el flujo debe o no ser por formulario unico acorde a indicadores de esCliente
				//modificadores: - S, X, y N - que no tengan marca cloud Se van a formulario unico
				if(BBVACloud.esClienteBBVA.esCliente == "S" || BBVACloud.esClienteBBVA.esCliente.trim() == "" ||BBVACloud.esClienteBBVA.esCliente == "X" || (BBVACloud.esClienteBBVA.esCliente == "N" && BBVACloud.esClienteBBVA.origen != "CLOUD")){

					log('::esClienteBBVA:: Rut presenta lógica para formulario único.');
					BBVACloud.forzarFormularioUnico = true;
					toggleInterfaceCloudFormularioUnico(false);

				}else{
					log('::esClienteBBVA:: Rut no es cliente. es posible que continúe con opcion Cloud');
				}

				ponerCapaCarga('facade');
				shiftTo('facade');

			},
			error   : function(request, textStatus, thrownError){

				log('::Error al tratar de recuperar la respuesta. Respuesta no existe o sin el formato valido');
				BBVACloud.forzarFormularioUnico = true;
				toggleInterfaceCloudFormularioUnico(false);

			}
		});

	}else{
		log('::esClienteBBVA:: Error, parametro necesario no informado(rutAcceso)');
	}
}

/*
 @brief			Despliega la modal de redireccion de clientes
*/
function mostrarModalRedireccionSitioPrivado(){

	setTimeout(function() {
		$('html,body', window.parent.document).animate({ scrollTop : $('header', window.parent.document).height() }, 'slow'), 500
		$("#modal-redireccion-nombre").text(BBVACloud.cliente.nombres);
		$("#modal-redireccion-acceso-cliente").modal();
	},500);

}

/*
 @brief			Cierra la modal de redireccion Acceso Clientes
*/
function cerrarModalRedireccionAccesoCliente(){
	$("#modal-redireccion-acceso-cliente .close-modal").click();
}

/*
 @brief			Recupera la informacion necesaria para poder avanzar al paso 4.
 @required		@notificacion cloud=3, producto en formato xx:yyyy (xx:codigo producto, yyyy: codigo subproducto)
 @param			productosPendientes => 11:0002;11:0005
 @param			callback, funciona a ejecutar cuando finalice exitosamente la ejecucion
*/
function recuperaInformacionSubirDocumentos(productosPendientes){

	var data	= {
		"solicitud"	: "continuarSolicitud",
		"idProducto": productosPendientes
	};

	$.ajax({
		url     : '/FUBBVAform/fuValidacion',
		type    : 'post',
		dataType: 'json',
		data    : data,
		success : function(json){

			BBVACloud.continuarSolicitud = json.continuarSolicitud;

			if(typeof BBVACloud.continuarSolicitud != 'undefined' && typeof BBVACloud.continuarSolicitud.listDigitalFolderChecklist.estadoGetChecklistNoCliente != 'undefined' && BBVACloud.continuarSolicitud.listDigitalFolderChecklist.estadoGetChecklistNoCliente == true){

				log('::recuperaInformacionSubirDocumentos('+productosPendientes+'):: estadoGetChecklistNoCliente: ' + BBVACloud.continuarSolicitud.listDigitalFolderChecklist.estadoGetChecklistNoCliente);

				actualizaInterfazSubirDocumentos(BBVACloud.continuarSolicitud.listDigitalFolderChecklist.digitalFolderChecklist);
				transicionFacadeSubirDocumentosAccesoBBVACloud();

			}else{
				log('::recuperaInformacionSubirDocumentos():: Error la consulta de estadoGetChecklistNoCliente');
			}

		},
		error   : function(request, textStatus, thrownError){
			log('::recuperaInformacionSubirDocumentos():: Error al tratar de recuperar la respuesta. Respuesta no existe o sin el formato valido');
			log(request); log(textStatus); log(thrownError);
		}
	});

}

/*
 @brief			Intenta acceder como un cliente Cloud BBVA
 @return		validaLoginAccesoCloud('15035142-1','7654321'); => {"estadoPeticion":"Servicio no existe"}
*/
function validaLoginAccesoCloud(rut,passAcceso){

	var rutAcceso	= utilsNumber.rellenarCeros(rut.replace(/[.,-]/g,""),10,false);

	log('::validaLoginAccesoCloud("' + rutAcceso + '","' + passAcceso + '"):: init');

	var data	= {
		"solicitud"	: "accesoCloud",
		"rut"		: rutAcceso,
		"pass"		: passAcceso
	};

	$.ajax({
		url     : '/FUBBVAform/fuValidacion',
		type    : 'post',
		dataType: 'json',
		data    : data,
		success : function(json){

			//formato de repuesta
			BBVACloud.validaAccesoCloud = json;

			//Caso primer acceso, fuerza cambio clave de acceso
			if(typeof BBVACloud.validaAccesoCloud.body != 'undefined' && BBVACloud.validaAccesoCloud.body.indexOf('J2A3010')>-1){

				log(':::: Existe un problema de actualizacion de clave de acceso (primer login)');
				//@DEPRECATED
				//despliegaFrameActualizacionClave(rutAcceso,passAcceso);
				toggleSolicitudDeActualizacionClaveAcceso();

			//Si no se detecta 1er acceso, puede haber login Ok, sigue con el flujo o login error, despliega mensaje error
			}else{

				log('::validaLoginAccesoCloud("' + rutAcceso + '","' + passAcceso + '"):: success');

				if(typeof BBVACloud.validaAccesoCloud != 'undefined' && typeof BBVACloud.validaAccesoCloud.login != 'undefined' && BBVACloud.validaAccesoCloud.login == 'true' && BBVACloud.validaAccesoCloud.body == ''){

					log('::validaLoginAccesoCloud:: login(' + BBVACloud.validaAccesoCloud.login + ')');
					log('::validaLoginAccesoCloud:: procede con el flujo de acceso.');
					/*
					"11:0002:11:0005"
					"11:0002"
					*/
					recuperaInformacionSubirDocumentos(getProductosPendientes(BBVACloud.pendientesCloud));

				}else{
					log('::validaLoginAccesoCloud(rut,pass):: Combinacion rut/pass no permite hacer login');
					despliegaBloqueErrorLogin();
				}

			}
		},
		error   : function(request, textStatus, thrownError){
			log('::Error al tratar de recuperar la respuesta. Respuesta no existe o sin el formato valido');
			log(request); log(textStatus); log(thrownError);
		}
	});
}

function getProductosPendientes(prendientesCloud){

	var productosPendientesCloud = '';

	if(typeof prendientesCloud != 'undefined' && prendientesCloud.length>0){

		$.each(prendientesCloud,function(i,pendienteCloud){
			productosPendientesCloud += pendienteCloud.producto + ';';	//	"11:0002;"
		});

		return productosPendientesCloud.substring(0,productosPendientesCloud.lastIndexOf(';'));

	}else{
		//Error al recueprar la informacion de los pendientes cloud. Parametro pendientesCloud no informado o sin informacion valida
		log('::getProductosPendientes():: Error al recueprar la informacion de los pendientes cloud. Parametro pendientesCloud no informado o sin informacion valida');
		return '';
	}

}

/*
 @brief			Consulta las notificaciones de un determinado rut
*/
function consultaSistemaNotificaciones(idProductoConsulta, parameters, callback){

	log('::consultaSistemaNotificaciones():: init');

	var data = {
		'solicitud' : 'getNotificacion'
	};

	if(typeof idProductoConsulta != 'undefined' && idProductoConsulta != '' && idProductoConsulta.length ==3){
		log('::Consulta presenta parametro idProducto(' + idProductoConsulta + ')');
		$.extend(data,{idProducto: idProductoConsulta});
	}else{
		log('::consultaSistemaNotificaciones:: Consulta sin parametro');
	}

	$.ajax({
		url     	: '/FUBBVAform/fuValidacion',
		type    	: 'post',
		dataType	: 'json',
		data    	: data,
		success		: function(json){

			BBVACloud.notificaciones = json;

			//Notificaciones Cloud
			if(typeof BBVACloud.notificaciones != 'undefined' && BBVACloud.notificaciones.length >0){

				log('::consultaSistemaNotificaciones():: Invoca consulta notificaciones');
				procesaNotificaciones(BBVACloud.notificaciones, parameters, callback);

			}else{

				log('::consultaSistemaNotificaciones():: no tiene notificaicones relevantes Cloud, consulta noficiaciones por formulario unico.');

				//Logica formulario Unico
				if(typeof parameters != 'undefined' && typeof parameters == 'object'){
					if(typeof callback != 'undefined' && typeof callback == 'function'){
						validaReingreso(parameters, callback);
					}else{
						//Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso
						log('::consultaSistemaNotificaciones(@validaReingreso)::Error:: Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso');
					}
				}else{
					//Parametros no informados o sin el formato correcto @FUnico, parametro objeto validaReingreso
					log('::consultaSistemaNotificaciones(@validaReingreso)::Error:: Parametros no informados o sin el formato correcto @FUnico, parametro objeto validaReingreso');
				}
			}
		},
		error   : function(request, textStatus, thrownError){
			log('::Error al tratar de recuperar la respuesta. Respuesta no existe o sin el formato valido');
			log(request); log(textStatus); log(thrownError);

			//Logica formulario unico
			if(typeof callback != 'undefined' && typeof callback == 'function'){
				callback();
			}
		}
	});
}

/*	@brief			procesa las las notificaciones disponibles
*/
function procesaNotificaciones(notificaciones, parameters, callback){

										//Contexto cloud completos
	solicitudCloudCompleta     = false; //Indicador rut posee al menos una solicitud cloud completa
	bufferSolicitudesCompletas = [];	//buffer de solicitudes Pendientes

										//Contexto cloud pendientes
	solicitudCloudPendiente    = false; //Indicador rut posee al menos una solicitud cloud pendiente
	bufferSolicitudesPendientes= [];	//buffer de solicitudes Pendientes

	if(notificaciones.length > 0){

		$.each(notificaciones,function(i, notificacion){

			if(esNotificacionCloudPendiente(notificacion)){

				log('::Detectada Notificacion por flujo cloud pendiente.');
				solicitudCloudPendiente = true;
				bufferSolicitudesPendientes.push(notificacion);

			}else{

				if(esNotificacionCloudCompleta(notificacion)){

					log('::Detectada Notificacion por flujo cloud completa.');
					solicitudCloudCompleta = true;
					bufferSolicitudesCompletas.push(notificacion);

				}else{
					log('::No corresponde a una notificacion atendida por flujo Cloud');
				}
			}
		});

		if(solicitudCloudCompleta){

			//Rut posee al menos una solicitude cloud completa, bufferNotificacion contiene el conjunto de notificaciones
			log('::Rut posee al menos una solicitude cloud completa, bufferNotificacion contiene el conjunto de notificaciones');
			mostrarModalSolicitudCompleta(bufferSolicitudesCompletas);

		}else{

			if(solicitudCloudPendiente){

				//Rut posee al menos una solicitude cloud pendiente, bufferNotificacion contiene el conjunto de notificaciones
				log('::Rut posee al menos una solicitude cloud pendiente, bufferNotificacion contiene el conjunto de notificaciones');
				mostrarModalCompletarSolicitud(bufferSolicitudesPendientes);

			}else{

				//A pesar de tener notificaciones, Rut no dispone de solicitudes Cloud Completas ni solicitudes cloud Pendientes.
				log('::A pesar de tener notificaciones, Rut no dispone de solicitudes Cloud Completas ni solicitudes cloud Pendientes.');

				//Logica formulario Unico
				if(typeof parameters != 'undefined' && typeof parameters == 'object'){
					if(typeof successHandler != 'undefined' && typeof successHandler == 'function'){
						validaReingreso(parameters, successHandler);
					}else{
						//Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso
						log('::procesaNotificaciones(@validaReingreso)::Error:: Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso');
					}
				}else{
					//Parametros no informados o sin el formato correcto @funico, parametro objeto validaReingreso
					log('::procesaNotificaciones(@validaReingreso)::Error:: Parametros no informados o sin el formato correcto @funico, parametro objeto validaReingreso');
				}
			}
		}

	}else{

		//listado de notificaciones no informado o sin informacion
		log('::procesaNotificaciones:: listado de notificaciones no informado o sin informacion');

		//Logica formulario Unico
		if(typeof parameters != 'undefined' && typeof parameters == 'object'){
			if(typeof successHandler != 'undefined' && typeof successHandler == 'function'){
				validaReingreso(parameters, successHandler);
			}else{
				//Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso
				log('::procesaNotificaciones(@validaReingreso)::Error:: Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso');
			}
		}else{
			//Parametros no informados o sin el formato correcto @funico, parametro objeto validaReingreso
			log('::procesaNotificaciones(@validaReingreso)::Error:: Parametros no informados o sin el formato correcto @funico, parametro objeto validaReingreso');
		}
	}

}

/*
 @brief		Determina si una notificaicon es o no una notificacion Cloud Completa
*/
function esNotificacionCloudCompleta(notificacion){

	if(typeof notificacion != 'undefined' && typeof notificacion == 'object' && typeof notificacion.cloud != 'undefined'){

		if(notificacion.cloud == "1"){
			log('::esNotificacionCloudCompleta():: Notificacion es cloud completa');
			return true;
		}else{
			log('::esNotificacionCloudCompleta():: Notificacion no es cloud completa');
			return false;
		}

	}else{
		//Error al rescatar el objeto notificacion dado como parametro, este viene sin el formato esperado o no viene informado
		log('::esNotificacionCloudCompleta:: Error al rescatar el objeto notificacion dado como parametro, este viene sin el formato esperado o no viene informado');
		return false;
	}

}

/*
 @brief			Determina si una notificaicon es o no una notificacion Cloud con Pendientes
*/
function esNotificacionCloudPendiente(notificacion){

	if(typeof notificacion != 'undefined' && typeof notificacion == 'object' && typeof notificacion.cloud != 'undefined'){

		if(notificacion.cloud == '3'){	//Estado Cloud en notificacion notificacion
			log('::esNotificacionCloudPendiente():: Notificacion es cloud pendiente');
			return true;
		}else{							//Notificacion no corresponde a una notificacion Cloud
			log('::esNotificacionCloudPendiente():: Notificacion no es cloud pendiente');
			return false;
		}

	}else{
		//Error al rescatar el objeto notificacion dado como parametro, este viene sin el formato esperado o no viene informado
		log('::esNotificacionCloudPendiente():: Error al rescatar el objeto notificacion dado como parametro, este viene sin el formato esperado o no viene informado');
	}
}

/*
 @brief			Consulta la validez de un documento de identidad en base a la serie informada
 @description	Consulta BD validacion Sinacofi
 @return
	consultaValidezCedula('A1');			=> {"estadoPeticion":"false"}		//Error
 @return
	consultaValidezCedula('A025550015');	=>
	{
		"serialNumber"        : "A025550015",
		"dicomReportDate"     : "2017-03-14T15:27:21.000-0600",
		"dicomUserName"       : "",
		"isIdentityCardActive": true,
		"blockingReason"      : "DOCUMENTO VIGENTE",
		"blockingDate"        : "2018-02-22T12:00:00.000-0600",
		"informationSource"   : "REGISTRO CIVIL"
	}
*/
function consultaValidezCedula(serie){

	var validaInline	= false;
	var serieConsulta	= (typeof serie != 'undefined' && serie != '') ? serie :$("#numeroSerieCedula").val();

	var data = {
		'solicitud'	: 'getIdentityCardStatus',
		'serie'		: serieConsulta
	};
	
	var customEnrollNewPerson = {
				'fechaNacimiento'   : getFechaNacimientoEnroll(),
				'mail'              : $('#field-email').val(),
				'comuna'            : $("#comuna").val(),
				'region'            : utilsNumber.rellenarCeros(Number($('#region').val()),2),
				'codigoCel'         : utilsNumber.rellenarCeros($('#lb_phone').val().substring(0,2),3),
				'numeroCel'         : $('#lb_phone').val().substring(2),
				'nomCompletoCliente': getNombreCompletoClienteActualizado(),
				'rangoRenta'        : '499000'
			} 
			;

			$.extend(data,customEnrollNewPerson);

	if(serieConsulta.length == 10){
		$.ajax({
			url     : '/FUBBVAform/fuValidacion',
			type    : 'post',
			dataType: 'json',
			data    : data,
			success : function(json){

				BBVACloud.validaCedula = json;
				if(typeof BBVACloud.validaCedula != 'undefined' && typeof BBVACloud.validaCedula.isIdentityCardActive != 'undefined' && BBVACloud.validaCedula.isIdentityCardActive != true){
					$("#numeroSerieCedula").attr('title','Lamentablemente no podemos atender su solicitud.').addClass('error-input');
				}else{
					$("#numeroSerieCedula").removeAttr('title').removeClass('error-input');
				}

				//Debug permite poder realizar el proceso de enrolamiento a pesar de existir un error en Sinacofi con la fecha configurada como blockingDate
				BBVACloud.validaCedula.blockingDate = '2020-02-22T12:00:00.000-0600';
			},
			error   : function(request, textStatus, thrownError){
				$("#numeroSerieCedula").attr('title','Error al validar numero de serie.').addClass('error-input');
			}
		});

	}
}

/*
 @brief			Valida que el valor de entrada asociado al campo dia sea valido
*/
function esDiaValido(dia){
	return Number(dia)>=1 && Number(dia)<=31;
}

/*
 @brief			Valida que el valor de entrada asociado al campo mes sea valido
*/
function esMesValido(mes){
	return Number(mes)>=1 && Number(mes)<=12;
}

/*
 @brief			Valida que el valor de entrada asociado al campo anio sea valido
*/
function esAnioValido(anio){
	return Number(anio)>=1900 && Number(anio)<=(new Date()).getFullYear();
}

/*
 @brief			Valida que la fecha ingresada en los campos dia, mes y año, de como resultado una edad mayor que 18
*/
function validaFechaNacimiento(){

	var dd	= $("#fnac_dd").val();
	var mm	= $("#fnac_mm").val();
	var aa	= $("#fnac_aaaa").val();

	if((dd.length == 2 && esDiaValido(dd)) && (mm.length == 2 && esMesValido(mm)) && (aa.length == 4 && esAnioValido(aa))){

		var hoy = new Date();
		var nac = new Date(aa,mm,dd);
		var difFechas = (hoy-nac)/1000;
		var edad = difFechas/31536000;

		log('::edad(' + edad + '):: Es mayor de edad? ' + (edad>18));
		if(edad<18){
			$("#fnac_dd, #fnac_mm, #fnac_aaaa").attr('title','Debe ser mayor de edad.').addClass('error-input');
			$("#confirmaAvanzaHazteCliente").addClass('btn-secondary button_disable').attr('disabled','disabled').attr('onclick','return false;');
		}else{
			$("#fnac_dd, #fnac_mm, #fnac_aaaa").removeAttr('title').removeClass('error-input');
			habilitaBotonEnviaSolicitud();
		}

	}else{
		if(!esDiaValido(dd))	$("#fnac_dd").attr('title','Ingresa un día valido').addClass('error-input');
		if(!esMesValido(mm))	$("#fnac_mm").attr('title','Ingresa un mes valido').addClass('error-input');
		if(!esAnioValido(aa))	$("#fnac_aaaa").attr('title','Ingresa un año valido').addClass('error-input');
		$("#confirmaAvanzaHazteCliente").addClass('btn-secondary button_disable').attr('disabled','disabled').attr('onclick','return false;');
	}

}

/*
 @brief			Valida que la solicitud puede ser tratada como una solicitud Cloud
*/
function solicitudHazteClientePuedeCloud(){

	log('::solicitudHazteClientePuedeCloud():: init');

	if(BBVACloud.esProductoCloud.esProductoCloud != 'true' || BBVACloud.validaBases.estadoValidaciones != 'true'){

		//########### Fuerza formulario unico
		$("#contenedor-btn-enviar-solicitud-funico").show();							//Muestra enviar solicitud Formulario unico
		$("#contenedor-btn-enviar-solicitud-funico .contenedorAnterior").show();		//Contenedor enlace << Anterior

		$("#divDatosComplementarios").hide();											//Esconde Contenedor datos complementarios cloud

		$("#contenedor-confirma-enviar-solicitud-cloud").hide();						//Esconde Enviar solicitud cloud
		$("#contenedor-confirma-enviar-solicitud-cloud .contenedorAnterior").hide();	//Contenedor enlace << Anterior

	}else{

		//########### Cloud disponible
		log(':: Cloud disponible');

		$("#contenedor-btn-enviar-solicitud-funico").hide();							//Esconde enviar solicitud Formulario unico
		$("#contenedor-btn-enviar-solicitud-funico .contenedorAnterior").hide();		//Contenedor enlace << Anterior

		$("#divDatosComplementarios").show();											//Muestra Contenedor datos complementarios cloud

		$("#contenedor-confirma-enviar-solicitud-cloud").show();						//Muestra Enviar solicitud cloud
		$("#contenedor-confirma-enviar-solicitud-cloud .contenedorAnterior").show();	//Contenedor enlace << Anterior


	}
}

/*

 @brief			Consulta si el producto ingresado corresponde a
 @return		esProductoCloud('009');		=>	{"esProductoCloud":"true"}
 @return		esProductoCloud('011:022');	=>	{"esProductoCloud":"true"}
 @reference		BBVACloud.esProductoCloud

 esProductoCloud(
	getProductosSeleccionados(), 																//"11:0002"
	validaBases,
	{ rut : $("#lb_rut").val(), productos : getArrayProductos(".itemActivo .checkProducto") },
	logicaSimuladores
	);
*/
function esProductoCloud(productos, callBack, parameters, successHandler){

	var data = {
		'solicitud'	: 'esProductoCloud',
		"idProducto": productos
	};

	BBVACloud.productosSeleccionados = getProductosSeleccionados();

	//De no corresponder a algún criterio excluyente para proceder con flujo Cloud entonces.
	if(!(BBVACloud.esClienteBBVA.esCliente == "S" || BBVACloud.esClienteBBVA.esCliente.trim() == "" || BBVACloud.esClienteBBVA.esCliente == "X" || (BBVACloud.esClienteBBVA.esCliente == "N" && BBVACloud.esClienteBBVA.origen != "CLOUD"))){

		//La session corresponde a un no-cliente(X|N) por lo que puede acceder a la logica Cloud
		log('::La session corresponde a un no-cliente por lo que puede acceder a la logica Cloud');

		$.ajax({
			url     : '/FUBBVAform/fuValidacion',
			type    : 'post',
			dataType: 'json',
			data    : data,
			success : function(json){

				BBVACloud.esProductoCloud = json;

				if(BBVACloud.esProductoCloud.esProductoCloud == 'true'){

					log('::esProductoCloud:: >> true');

					BBVACloud.productosSeleccionados = productos;

					if(typeof callBack != 'undefined' && typeof callBack == 'function'){
						callBack(parameters, successHandler);
					}

				}else{

					//No tiene acceso a Cloud por no ser un producto cloud, sigue logica de Formulario unico
					log('::esProductoCloud:: >> false');
					BBVACloud.forzarFormularioUnico = true;
					toggleInterfaceCloudFormularioUnico(false);

					//Logica formulario Unico
					validaReingreso(parameters, successHandler);
				}
			},
			error   : function(request, textStatus, thrownError){

				log('::esProductoCloud:: >> error');

				BBVACloud.forzarFormularioUnico = true;
				toggleInterfaceCloudFormularioUnico(false);

			}
		});

	}else{

		log('::La session corresponde a un cliente(indicador S) por lo que solo tiene posibilidad de acceder a travez de la logica de Formulario Unico');
		BBVACloud.forzarFormularioUnico = true;
		toggleInterfaceCloudFormularioUnico(false);

		validaReingreso(parameters, successHandler);

	}
}

/*
 @brief			Genera una cadena de codigos de productos seleccionados
 @description	Documentacion entregada por D&D

	CUENTA VISTA WEB		Producto: 11		Subproducto: 0001
	CONSUMO WEB				Producto: 11		Subproducto: 0002

	Ejemplo con Credito de consumo seleccionado:
	getProductosSeleccionados()		=>	"11:0002"

	Caso que no exista el codigo de producto cloud (Por ejemplo Cuenta corriente + Credito de consumo)
	getProductosSeleccionados()		=>	"99:9999;11:0002"
*/
function getProductosSeleccionados(){
	var cadenaCodigos = '';

	$.each($("#lista-productos .itemActivo .checkProducto"),function(i, producto){
		cadenaCodigos += $(producto).attr('idproductocloud') != "" ? ($(producto).attr('idproductocloud') + ':' + $(producto).attr('idsubproductocloud') + ';') : '99:9999;';
	});

	return cadenaCodigos.substring(0,cadenaCodigos.lastIndexOf(';'));

}

/*
 @brief			Valida bases BaseNO, PEP, Dicom
 @return		validaBases();	=>	//Error
 @return		validaBases();	=>	//Daniel A. Valenzuela C.

*/
function validaBases(parameters, successHandler){

	var data = {
		'solicitud'	: 'validaBases'
	};

	$.ajax({
		url     : '/FUBBVAform/fuValidacion',
		type    : 'post',
		dataType: 'json',
		data    : data,
		success : function(json){

			BBVACloud.validaBases = json;

			if(BBVACloud.validaBases != null && typeof BBVACloud.validaBases.estadoValidaciones != 'undefined' && BBVACloud.validaBases.estadoValidaciones != ''){

				//BBVACloud.validaBases.estadoValidaciones != true es que no esta en las Bases
				if(BBVACloud.validaBases.estadoValidaciones == 'false'){

					log('::validaBases():: Valida bases(false), procede con opcion Cloud disponible.');

					//Consulta sistema de notificaciones, con codigos de productos seleccionados
					consultaSistemaNotificaciones(getProductosSeleccionados(), parameters, successHandler);

					//Prepara la interfaz para ser tratada como una solicitud Cloud
					BBVACloud.forzarFormularioUnico = false;
					toggleInterfaceCloudFormularioUnico(true);

				}else{

					log('::validaBases():: procede sin opcion Cloud. Accede como formulario unico');

					BBVACloud.forzarFormularioUnico = true;
					toggleInterfaceCloudFormularioUnico(false);

					//Logica formulario Unico
					if(typeof parameters != 'undefined' && typeof parameters == 'object'){
						if(typeof successHandler != 'undefined' && typeof successHandler == 'function'){
							validaReingreso(parameters, successHandler);
						}else{
							//Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso
							log('::validaBases(@validaReingreso)::Error:: Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso');
						}
					}else{
						//Parametros no informados o sin el formato correcto @FUnico, parametro objeto validaReingreso
						log('::validaBases(@validaReingreso)::Error:: Parametros no informados o sin el formato correcto @FUnico, parametro objeto validaReingreso');
					}
				}

			}else{

				log('::validaBases():: procede sin opcion Cloud. Accede como formulario unico');

				BBVACloud.forzarFormularioUnico = true;
				toggleInterfaceCloudFormularioUnico(false);

				if(typeof parameters != 'undefined' && typeof parameters == 'object'){
					if(typeof successHandler != 'undefined' && typeof successHandler == 'function'){
						validaReingreso(parameters, successHandler);
					}else{
						//Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso
						log('::validaBases()::Error:: Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso');
					}
				}else{
					//Parametros no informados o sin el formato correcto @FUnico, parametro objeto validaReingreso
					log('::validaBases()::Error:: Parametros no informados o sin el formato correcto @FUnico, parametro objeto validaReingreso');
				}

			}
		},
		error   : function(request, textStatus, thrownError){	//Error al tratar de recuperar la respuesta. Respuesta no existe o sin el formato valido

			log('::validaBases():: procede sin opcion Cloud. Accede como formulario unico');

			BBVACloud.forzarFormularioUnico = true;
			toggleInterfaceCloudFormularioUnico(false);

			if(typeof parameters != 'undefined' && typeof parameters == 'object'){
				if(typeof successHandler != 'undefined' && typeof successHandler == 'function'){
					validaReingreso(parameters, successHandler);
				}else{
					//Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso
					log('::validaBases()::Error:: Parametros no informados o sin el formato correcto @formulario unico, callBack function validaReingreso');
				}
			}else{
				//Parametros no informados o sin el formato correcto @FUnico, parametro objeto validaReingreso
				log('::validaBases()::Error:: Parametros no informados o sin el formato correcto @FUnico, parametro objeto validaReingreso');
			}

		}
	});
}

/*
 @brief			On/off componentes de interfaz Cloud, Formulario Unico
 @param			Boolean(muestraCloud) true: muestra cloud, false: muestra formulario unico
*/
function toggleInterfaceCloudFormularioUnico(muestraCloud){

	if(muestraCloud){

		$("#divDatosComplementarios").show();						//Datos complementarios
		$("#informacion-lateral-adicional-cloud").show();			//Bloque lateral informacion

		$("label[for=uploadFiles]").click();						//Despliega datos complementarios

		$("#contenedor-confirma-enviar-solicitud-cloud").show();	//Cloud hazte cliente
		$("#contenedor-btn-enviar-solicitud-funico").hide();		//formulario unico

	}else{

		$("#divDatosComplementarios").hide();						//Datos complementarios
		$("#informacion-lateral-adicional-cloud").hide();			//Bloque lateral informacion
		$("#contenedor-confirma-enviar-solicitud-cloud").hide();	//Cloud hazte cliente
		$("#contenedor-btn-enviar-solicitud-funico").show();		//formulario unico

	}

}

/*
 @brief			Despliega la modal de envio SMS
*/
function mostrarModalEnvioSMS(){

	log('::mostrarModalEnvioSMS():: init');

	if(BBVACloud.enrollNewPerson.listDigitalFolderChecklist.estadoGetChecklistNoCliente){

		//Cliente procede desde el flujo de enrolamiento por lo que corresponde validar la logica de envio de SMS
		log('::Cliente procede desde el flujo de enrolamiento por lo que corresponde validar la logica de envio de SMS');

		if(BBVACloud.esClienteBBVA.esCliente == 'I'){

			log('::Inicia proceso envio SMS');

			var envioSms = {
				'solicitud': 'envioSms'
			}

			$.ajax({
				url     : '/FUBBVAform/fuValidacion',
				type    : "post",
				dataType: "json",
				data    : envioSms,
				success : function(json){

					BBVACloud.envioSms = json;

					if(typeof BBVACloud.envioSms != 'undefined' && typeof BBVACloud.envioSms.codigoRetorno != 'undefined' && BBVACloud.envioSms.codigoRetorno == "OK"){

						log('::mostrarModalEnvioSMS():: Success, Envio Sms exitoso(' + BBVACloud.envioSms.codigoRetorno + ') ' + BBVACloud.envioSms.mensajeRetorno);
						log('::mostrarModalEnvioSMS():: Muestro modal.');

						$("#modals").modal();

					}else{
						//Error en algun proceso asociado con el envio SMS
						log('::mostrarModalEnvioSMS():: Error al intentar enviar el mensaje SMS.');

						$("#mensajeErrorEnvioSMS").text(BBVACloud.envioSms.mensajeRetorno.toLowerCase().capitalize());
						//$("#modalErrorEnvioSMS").modal();
						//Por solicitud de D&D se redirige a solicitud enviada exitosamente
						terminarSolcitudUpload();
					}
				},
				error   : function(request,status,error){
					log('::mostrarModalEnvioSMS():: Error al intentar recuperar la respuesta de la operacion de envío de Sms.');
					//$("#modalErrorEnvioSMS").modal();
					//Por solicitud de D&D se redirige a solicitud enviada exitosamente
					terminarSolcitudUpload();
				}
			});

		}else{
			log('::Envio SMS no requerido, cliente no califica (BBVACloud.esClienteBBVA.esCliente = ' + BBVACloud.esClienteBBVA.esCliente + ')');
			$("#modalInfoEnvioSMS").modal();
		}

	}else{
		//Envio SMS no requerido, cliente procede con el flujo de continuar solicitud
		log('::Envio SMS no requerido, cliente procede con el flujo de continuar solicitud');
		$("#modalInfoEnvioSMS").modal();
	}
}

/*
 @brief		Valida acceso
*/
function accedeBbvaCloud(){
	mostrarModalAccesoBBVACloud();
}

/*
 @brief			Despliega la modal de envio SMS
*/
function mostrarModalAccesoBBVACloud(parametroAcceso){

	setTimeout(function() {

		$("#pwdAcceso").off('keypress').on('keypress',function(event){
			clearLoginError();
			this.value = this.value.replace(/[^a-zA-Z\s\d]/g,'');
		});

		$('html,body', window.parent.document).animate({ scrollTop : $('header', window.parent.document).height() }, 'slow'), 500

		if(typeof parametroAcceso != 'undefined' && parametroAcceso != ''){
			$("#rutAcceso").val(parametroAcceso);
		}else{

			$("#rutAcceso").val('');
			clearFieldError("#rutAcceso");

			$("#pwdAcceso").val('');
			clearFieldError("#pwdAcceso");

			$("#acceso-bbva-error-login").hide();
			clearLoginError();
		}

		$("#modal-acceso-bbva-cloud").modal();
	},500);

}

/*
 @brief			Despliega la modal informativa no posee pendientes BBVA Cloud
*/
function mostrarModalSinPendientes(nombreAccesso){

	setTimeout(function() {
		$('html,body', window.parent.document).animate({ scrollTop : $('header', window.parent.document).height() }, 'slow'), 500
		if(typeof nombreAccesso != 'undefined' && nombreAccesso != ''){
			$("#modal-sin-pendientes-nombre").text(nombreAccesso);
		}else{
			$("#texto-sin-pendientes-nombre").html('<strong>En estos momentos no dispones de ninguna solicitud cloud pendiente de documento.</strong>');
		}
		$("#modal-sin-pendientes-cloud").modal();
	},500);

}

/*
 @brief			Despliega la modal Completar solicitud
 @param			Objeto Notificacion
*/
function mostrarModalCompletarSolicitud(listadoNotificaciones){

	log('::mostrarModalCompletarSolicitud(listadoNotificaciones)');

	if(typeof listadoNotificaciones != 'undefined' && listadoNotificaciones.length >0){

		solicitudesRelacionadasNombre = '';
		solicitudesRelacionadasFechaEnvio= '';

		$.each(listadoNotificaciones,function(i,notificacion){

			log('DEBUG @mostrarModalCompletarSolicitud > $.each(listadoNotificaciones, notificacion)');
			log('notificacion.producto: ' + notificacion.producto + ' || getNombreProducto(notificacion.producto): ' + getNombreProducto(notificacion.producto));
			log('notificacion.fechaEnvio: ' + notificacion.fechaEnvio + ' || getFechaSolicitud(notificacion.fechaEnvio): ' + getFechaSolicitud(notificacion.fechaEnvio));

			solicitudesRelacionadasNombre += getNombreProducto(notificacion.producto) + ', ';
			solicitudesRelacionadasFechaEnvio += getFechaSolicitud(notificacion.fechaEnvio) + ', ';
		});

		solicitudesRelacionadasNombre = solicitudesRelacionadasNombre.substring(0,solicitudesRelacionadasNombre.lastIndexOf(','));

		if(solicitudesRelacionadasNombre.indexOf(',')>-1){
			solicitudesRelacionadasNombre = solicitudesRelacionadasNombre.substring(0,solicitudesRelacionadasNombre.lastIndexOf(',')) + ' y' + solicitudesRelacionadasNombre.substring((solicitudesRelacionadasNombre.lastIndexOf(',')+1),solicitudesRelacionadasNombre.length);
		}

		solicitudesRelacionadasFechaEnvio = solicitudesRelacionadasFechaEnvio.substring(0,solicitudesRelacionadasFechaEnvio.lastIndexOf(','));

		if(solicitudesRelacionadasFechaEnvio.indexOf(',')>-1){
			solicitudesRelacionadasFechaEnvio = solicitudesRelacionadasFechaEnvio.substring(0,solicitudesRelacionadasFechaEnvio.lastIndexOf(',')) + ' y' + solicitudesRelacionadasFechaEnvio.substring((solicitudesRelacionadasFechaEnvio.lastIndexOf(',')+1),solicitudesRelacionadasFechaEnvio.length);
		}

		if(listadoNotificaciones.length>1){
			solicitudesRelacionadasFechaEnvio += ' respectivamente';
		}

		//Agrega nombre a modal de completar solicitud
		if(BBVACloud.cliente.nombreCompleto != ''){
			$("#modal-completar-solicitud #modal-completar-solicitud-nombre").text(BBVACloud.cliente.nombreCompleto + ', tienes ');
		}else{
			$("#modal-solicitud-completa #modal-completar-solicitud-nombre").text('Tienes ');
		}

		//Glosa producto en notificacion @getNombreProducto
		$("#modal-completar-solicitud #mcs-producto-glosa").text(solicitudesRelacionadasNombre);

		//Fecha envio en notificacion @getFechaSolicitud
		$("#modal-completar-solicitud #mcs-producto-fecha").text(solicitudesRelacionadasFechaEnvio);

		setTimeout(function() {
			$('html,body', window.parent.document).animate({ scrollTop : $('header', window.parent.document).height() }, 'slow'), 500
			$("#modal-completar-solicitud").modal();
		},500);

	}else{
		//la notificacion no fue dada como parametro o esta no contiene datos
		log('::mostrarModalCompletarSolicitud():: Error: La notificacion no fue dada como parametro o esta no contiene datos');
	}
}

/*
 @brief			Despliega la modal solicitud completa
 @param			Objeto Notificacion
*/
function mostrarModalSolicitudCompleta(listadoNotificaciones){

	log('::mostrarModalSolicitudCompleta(listadoNotificaciones)');

	if(typeof listadoNotificaciones != 'undefined' && listadoNotificaciones.length >0){

		solicitudesRelacionadasNombre = '';
		solicitudesRelacionadasFechaEnvio= '';

		$.each(listadoNotificaciones,function(i,notificacion){

			log('DEBUG @mostrarModalCompletarSolicitud > $.each(listadoNotificaciones, notificacion)');
			log('notificacion.producto: ' + notificacion.producto + ' || getNombreProducto(notificacion.producto): ' + getNombreProducto(notificacion.producto));
			log('notificacion.fechaEnvio: ' + notificacion.fechaEnvio + ' || getFechaSolicitud(notificacion.fechaEnvio): ' + getFechaSolicitud(notificacion.fechaEnvio));

			solicitudesRelacionadasNombre += getNombreProducto(notificacion.producto) + ', ';
			solicitudesRelacionadasFechaEnvio += getFechaSolicitud(notificacion.fechaEnvio) + ', ';
		});

		solicitudesRelacionadasNombre = solicitudesRelacionadasNombre.substring(0,solicitudesRelacionadasNombre.lastIndexOf(','));

		if(solicitudesRelacionadasNombre.indexOf(',')>-1){
			solicitudesRelacionadasNombre = solicitudesRelacionadasNombre.substring(0,solicitudesRelacionadasNombre.lastIndexOf(',')) + ' y' + solicitudesRelacionadasNombre.substring((solicitudesRelacionadasNombre.lastIndexOf(',')+1),solicitudesRelacionadasNombre.length);
		}

		solicitudesRelacionadasFechaEnvio = solicitudesRelacionadasFechaEnvio.substring(0,solicitudesRelacionadasFechaEnvio.lastIndexOf(','));

		if(solicitudesRelacionadasFechaEnvio.indexOf(',')>-1){
			solicitudesRelacionadasFechaEnvio = solicitudesRelacionadasFechaEnvio.substring(0,solicitudesRelacionadasFechaEnvio.lastIndexOf(',')) + ' y' + solicitudesRelacionadasFechaEnvio.substring((solicitudesRelacionadasFechaEnvio.lastIndexOf(',')+1),solicitudesRelacionadasFechaEnvio.length);
		}

		if(listadoNotificaciones.length>1){
			solicitudesRelacionadasFechaEnvio += ' respectivamente';
		}

		//Agrega nombre a modal de completar solicitud
		$("#modal-solicitud-completa #modal-solicitud-completa-nombre").text(BBVACloud.cliente.nombreCompleto);

		//Glosa producto en notificacion @getNombreProducto
		$("#modal-solicitud-completa #msc-producto-glosa").text(solicitudesRelacionadasNombre);

		//Fecha envio en notificacion @getFechaSolicitud
		$("#modal-solicitud-completa #msc-producto-fecha").text(solicitudesRelacionadasFechaEnvio);

		setTimeout(function() {
			$('html,body', window.parent.document).animate({ scrollTop : $('header', window.parent.document).height() }, 'slow'), 500
			$("#modal-solicitud-completa").modal();
		},500);

	}else{
		//la notificacion no fue dada como parametro o esta no contiene datos
		log('::mostrarModalSolicitudCompleta():: Error: La notificacion no fue dada como parametro o esta no contiene datos');
	}
}

/*	@brief		Btn Si, deseo enviar la solicitud nuevamente(fuerza formulario unico), modal rut tiene solicitud completa

*/
function btnSiSolicitudCompleta(){

	log('::btnSiSolicitudCompleta:: Rut solicito enviar nuevamente la solicitud, fuerza flujo a logica formulario unico');
	BBVACloud.forzarFormularioUnico = true;
	toggleInterfaceCloudFormularioUnico(false);

	log('::Cierra la modal que esta actualmente activa, Modal solicitud completa, invoca logica simuladores.');
	$('#modal-solicitud-completa .close-modal').click();
	logicaSimuladores();

}

/*	@brief		Btn No, deseo enviar la solicitud nuevamente, modal rut tiene solicitud completa
*/
function btnNoSolicitudCompleta(){
	//Cierra la modal que esta actualmente activa, Modal solicitud completa, no realiza ninguna comprobacion de logica
	log('::Cierra la modal que esta actualmente activa, Modal solicitud completa, no realiza ninguna comprobacion de logica');
	$('#modal-solicitud-completa .close-modal').click();
}

/*
 @brief			Rescata la glosa de un producto informado en una notificacion, en base a un codigo de producto
*/
function getNombreProducto(codigo){

	var glosaProducto = '';

		switch(codigo){
			case "11:0002"	:	glosaProducto = "Cr\u00E9dito de Consumo";
								break;
			default			:	log('Error al recuperar la correlacion codigo de producto glosa nombre producto');
								break;
		}


	return glosaProducto;
}

/*
 @brief			Rescata la fecha de envío de una notificacion
 @param			fechaEnvio string
 @format		"Mar 7, 2017 11:04:40 AM"
 @test			getFechaSolicitud("Mar 7, 2017 11:04:40 AM");
*/
function getFechaSolicitud(fechaEnvio){

	var fechaFormateada = '';
	if(typeof fechaEnvio != 'undefined' && fechaEnvio != ''){

		var dFechaEnvio = new Date(fechaEnvio);
		fechaFormateada = $.datepicker.formatDate('dd/mm/yy', dFechaEnvio);

	}else{
		//fecha de envio de solicitud no informada o sin el formato requerido
		log('::getFechaSolicitud(fechaEnvio):: fecha de envio de solicitud no informada o sin el formato requerido');
	}

	return fechaFormateada;

}

/*
 @brief			devuelve la fecha de naciemiento ingresada en interfaz en el formato requerido por enrollNewPerson
 @formato		'1991-11-14T00:00:00'
*/
function getFechaNacimientoEnroll(){

	if(validaIngresoFechaNacimiento()){
		return $("#fnac_aaaa").val() + '-' + $("#fnac_mm").val() + '-' + $("#fnac_dd").val() + 'T00:00:00';
	}else{
		log('::getFechaNacimientoEnroll():: Error al recuperar la fecha de nacimiento.');
		return '';
	}

}

function validaIngresoFechaNacimiento(){
	if($("#fnac_dd").val() != '' && $("#fnac_mm").val() != '' && $("#fnac_aaaa").val() != ''){
		return true;
	}else{
		log("::validaFechaNacimiento():: Error al validar la fecha de nacimiento ingresada por la interfaz por el usuario, rescatada");
		return false;
	}
}

function getCiudadEnroll(codigoConsulta){

	var objResultadoConsulta = relacionRegionCiudadComunaPU.filter(function(e){
		if(e.ComunaPU == codigoConsulta){
			return true;
		}else{
			return false;
		}
	});

	if(objResultadoConsulta.length>0){
		return objResultadoConsulta.first().CiudadPU;
	}else{
		//Error al tratar de recuperar la ciudad del objeto de referencia dado el parametro de consulta
		log('::getCiudadEnroll:: Error al tratar de recuperar la ciudad del objeto de referencia dado el parametro de consulta');
		return '';
	}
}

function enviarSolicitudHazteCliente(){

	if(!$("#uploadFiles").is(":checked") || $("#lb_nacionalidad").val() == 'USA'){	//Legacy PDI, agregada la logica para forzar FUnico caso EEUU

		log("::enviarSolicitudHazteCliente:: Flujo relacionado con formulario unico invocado.");
		$("#enviarSolicitud").click();

	}else{								//Cloud

		log("::enviarSolicitudHazteCliente:: Flujo Cloud invocado. Inicio validaciones");

		if($("#files").is(':visible')){

			log('::Informacion complementaria disponible en la interfaz. Es necesario realizar las validaciones.');

			//Nombres
			validateNameFiled("#dc_nombre");

			//Apellidos
			//validateNameFiled("#dc_apellidos");
			validateCompundLastNameField("#dc_apellidos");

			//Calle
			validateNameFiled("#dc_calle");

			//N° Calle
			validateNameFiled("#dc_calle_numero");

			//Valida tipo de direccion
			//validateTipoDirectField("#ui-id-1-button");

			//N° tipo direccion
			//validateNameFiled("#tipo_numero");

			//Valida nacionalidad
			validateNacionalidadField("#lb_nacionalidad-button");

			//Valida estado civil
			validateEstadoCivilField("#lb_civ_sta-button");

			/*
			if (hasInvalidFields("#files")) {
				return;
			}
			*/

		}else{
			//Informacion no disponible actualmente en la interfaz. No procede validar
			log('::Informacion no disponible actualmente en la interfaz. No procede validar');
		}

		var enrollNewPerson = {
			'solicitud'			: 'enrollNewPerson',
			'rangoRenta'        : '499000'
		}

		if(BBVACloud.esClienteBBVA.esCliente == 'I'){

			log('::Cliente necesita informacion adicional de enrolamiento.');
			log('::Enriquece objeto enrolamiento con informacion complementaria.');

			var customEnrollNewPerson = {
				'numeroSerie'       : $('#numeroSerieCedula').val(),
				'expiryDate'        : BBVACloud.validaCedula.blockingDate.split("T")[0] + 'T00:00:00',
				'nomCompletoCliente': getNombreCompletoClienteActualizado(),
				'fechaNacimiento'   : getFechaNacimientoEnroll(),
				'sexo'              : validaInformacionGenero(),
				'estadoCivil'       : $('#lb_civ_sta').val(),
				'mail'              : $('#field-email').val(),
				'calle'             : $('#dc_calle').val(),
				'numeroDir'         : $('#dc_calle_numero').val(),
				'tipoDir'           : obtenerTipoDireccion($('#ui-id-1').val()),
				'numTipoDir'        : obtenerTipoDireccionNumero($('#tipo_numero').val()),
				'comuna'            : $("#comuna").val(),
				'ciudad'            : getCiudadEnroll($("#comuna").val()),
				'region'            : utilsNumber.rellenarCeros(Number($('#region').val()),2),
				'codigoCel'         : utilsNumber.rellenarCeros($('#lb_phone').val().substring(0,2),3),
				'numeroCel'         : $('#lb_phone').val().substring(2),
				'productosSel'      : BBVACloud.productosSeleccionados,
				'nacionalidad'      : $("#lb_nacionalidad").val() == 'CHI' ? 'CHI': 'EXT',
				'origen'			: $("#lb_nacionalidad").val()
			};

			$.extend(enrollNewPerson,customEnrollNewPerson);

		}else{
			log('::Cliente no requiere informacion adicional de enrolamiento.');
		}

		BBVACloud.datosComplementarios = enrollNewPerson;
		log("::enviarSolicitudHazteCliente:: enrollNewPerson");
		log(enrollNewPerson);

		$.ajax({
			url     : '/FUBBVAform/fuValidacion',
			type    : "post",
			dataType: "json",
			data    : enrollNewPerson,
			success : function(json){

				BBVACloud.enrollNewPerson = json.enrollNewPerson;

				if(BBVACloud.enrollNewPerson.estadoEnrolamiento == true){

					log('::enviarSolicitudHazteCliente:: Success, enrollNewPerson.');

					if(BBVACloud.enrollNewPerson.listDigitalFolderChecklist.estadoGetChecklistNoCliente == true){

						log('::enviarSolicitudHazteCliente:: Success, listDigitalFolderChecklist.');
						actualizaInterfazSubirDocumentos(BBVACloud.enrollNewPerson.listDigitalFolderChecklist.digitalFolderChecklist);
						transicionCloudSubirDocumentos();

					}else{
						log('::enviarSolicitudHazteCliente:: Error, listDigitalFolderChecklist.');
						terminarSolcitudUpload();
					}

				}else{
					log('::enviarSolicitudHazteCliente:: Error enrollNewPerson.');
					terminarSolcitudUpload();
				}
			},
			error   : function(request,textStatus,thrownError){
				log('::enviarSolicitudHazteCliente():: Error al tratar de recuperar la respuesta. Respuesta no existe o sin el formato valido');
				log(request); log(textStatus); log(thrownError);

				terminarSolcitudUpload();
			}
		});
	}
}

/*	@brief	Obtiene el tipo de direccion a informar al servicio de enrolamiento

*/
function obtenerTipoDireccion(tipoDireccion){
	return tipoDireccion;
}

function obtenerTipoDireccionNumero(tipoDireccionNumero){
	return tipoDireccionNumero;
}

function actualizaInterfazSubirDocumentos(digitalFolderChecklist){

	log('::actualizaInterfazSubirDocumentos:: Actualiza la interfaz para subir documentos.');

	$("#productRequestsContainer").empty();
	var existeSolicitudPendiente = false;
	$.each(digitalFolderChecklist,function(i,productRequestChecklist){
		var solicitudPendiente = generaBloqueSolicitudPendiente(productRequestChecklist.productRequestId,productRequestChecklist.checklists);
		if(solicitudPendiente != ''){
			$("#productRequestsContainer").append(solicitudPendiente);
			existeSolicitudPendiente = true;
		}
	});
	if(existeSolicitudPendiente == false){
		log('::No tiene documentos pendientes.');
		terminarSolcitudUpload();
	}
}

/*
 @brief		Compone el nombre completo del cliente
*/
function getNombreCompletoClienteActualizado(){
	return $("#dc_nombre").val() + ' ' + $("#dc_apellidos").val();
}

/*
 @brief			Avanza de seccion
*/
function transicionCloudSubirDocumentos(){

	log('::transicionCloudSubirDocumentos:: init');
	shiftTo('step_three');

	$("#step_fourth").fadeIn("fast");
	$("#step_three").find('.blocked_disabled').css("z-index", "1");
	$("#step_fourth").find('.blocked_disabled').css("z-index", "-1");
	$("#confirmaAvanzaHazteCliente").addClass("button_disable").attr("disabled", "true");

	/*
	$('html,body', window.parent.document).animate({
		scrollTop : $("#step_fourth").offset().top + $('header', window.parent.document).height()
	}, 'slow');

	*/
}

/*
 @TODO			Consulta pendientes, documentos pendientes en Carpeta, luego acorde consultar checklist asociado
 @brief			Accede al paso subir documentos, una vez que se ha accedido a travez de la modal de Acceso BBVA Cloud
*/
function transicionFacadeSubirDocumentosAccesoBBVACloud(){

	//Cierra la modal de Acceso BBVA Cloud
	$("#modal-acceso-bbva-cloud .close-modal").click();
	shiftTo('facade');
	shiftTo('step_one');

	$("#step_fourth").fadeIn("fast");

	$("#facade").find('.blocked_disabled').css("z-index", "1");
	$("#step_one").find('.blocked_disabled').css("z-index", "1");
	$("#step_fourth").find('.blocked_disabled').css("z-index", "-1");

}

/*	@brief		Toggle datos complementarios
*/
function toggleDatosComplementarios(){

	log('::toggleDatosComplementarios init');

	setTimeout(function(){

		if(!$("#uploadFiles").is(":checked")){		//Elimina check de subir mis documentos con bbva cloud

			if(BBVACloud.esClienteBBVA.esCliente == 'I'){
				log('::BBVACloud.esClienteBBVA.esCliente(' + BBVACloud.esClienteBBVA.esCliente + ')');
				$("#files").slideUp();
				habilitaBotonEnviaSolicitud();
			}

		}else{										//Check marcado - subir mis documentos con bbva cloud

			if(BBVACloud.esClienteBBVA.esCliente == 'I'){
				$("#files").slideDown();
			}

			habilitaBotonEnviaSolicitud();
		}

	},50);

}


