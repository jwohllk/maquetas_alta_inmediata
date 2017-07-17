/******************************************************************
 Funcionalidades utilizadas en subir documentos hazte cliente cloud
******************************************************************/

function terminarSolcitudUpload(){

	log('::terminarSolcitudUpload');
	$(".formcontent.container_fluid").hide();
	$("#solicitudError").hide();
	$("#solicitudEnviada").show();
}

function cerrarUploadDocuments(){

	log('::cerrarUploadDocuments');
	if(BBVACloud.enrollNewPerson.listDigitalFolderChecklist.estadoGetChecklistNoCliente){
		if(BBVACloud.informacionCompiladaUploadDocuments.cantidadDocumentosCargados < BBVACloud.informacionCompiladaUploadDocuments.numeroTotalDeDocumentos){
 
			//Solicitud con al menos uno de los documentos cargados con error, se invoca modal envio SMS
			log('::Solicitud con al menos uno de los documentos cargados con error, se invoca modal envio SMS');
			$("#modals").modal();

		}else{
			//Solicitud sin reparos en la subida de documentos
			log('::Solicitud sin reparos en la subida de documentos, invoca bloque Solicitud enviada correctamente.');
			terminarSolcitudUpload();
		}
	}else{
		//Envio SMS no requerido, cliente procede con el flujo de continuar solicitud
		log('::Envio SMS no requerido, cliente procede con el flujo de continuar solicitud');
		$("#modalInfoEnvioSMS").modal();
	}

}

function aceptarModalEnvioSmsHazteCliente(){
	$("#modalInfoEnvioSMS").find('.close-modal').click();
	$("#modals").find('.close-modal').click();
	terminarSolcitudUpload();
}

/*
 @brief		Genera el bloque asociado a una solictud
 @formato
*/
function generaBloqueSolicitudPendiente(productRequestId, productRequestChecklist){

	var bloqueSolicitudPendiente = '';

	if(productRequestChecklist.length > 0){
		
		var bloqueDocumentosRequeridos = getBloqueDocumentosRequeridos(productRequestChecklist);
		
		
		
		if(bloqueDocumentosRequeridos != ''){
		
			var objSolicitud = solicitudPendiente(productRequestChecklist[0]);
			log('::generaBloqueSolicitudPendiente:: objSolicitud');
			log(objSolicitud);

			var claveBloqueSolicitud = objSolicitud.id + '' + objSolicitud.subProduct.id;

			bloqueSolicitudPendiente += '<div class="cloudProductRequest" productrequestid="' + productRequestId + '" productid="' + objSolicitud.id + '" subproductid="' + objSolicitud.subProduct.id + '">';
			bloqueSolicitudPendiente += '	<div class="row block_one_column" style="margin-right:-25px;padding-left:30px;">';
			bloqueSolicitudPendiente += '		<div style="margin-bottom:20px;">Archivos permitidos: txt, pdf y jpg. Peso Máximo: 3MB.</div>';
			bloqueSolicitudPendiente += '		<h4>Documentos requeridos para: ' + objSolicitud.name.toLowerCase().capitalize() + '.</h4>';
			bloqueSolicitudPendiente += '	</div>';
			bloqueSolicitudPendiente += '	<div>';
			bloqueSolicitudPendiente += '		<div class="row block_two_columns uploadTable">';
			bloqueSolicitudPendiente += '			<article>';
			bloqueSolicitudPendiente += '				<form class="formularioSolicitudPendiente myform" enctype="multipart/form-data" action="/FUBBVAform/uploadDocument" method="POST" productid="' + objSolicitud.id + '" subproductid="' + objSolicitud.subProduct.id + '">';
			bloqueSolicitudPendiente += '					<div class="tableUpload">';
			bloqueSolicitudPendiente += 					bloqueDocumentosRequeridos;
			bloqueSolicitudPendiente += '					</div>';
			bloqueSolicitudPendiente += '					<input class="subirArchivo" type="submit" value="Subir archivo" style="display:none"/>';
			bloqueSolicitudPendiente += '				</form>';
			bloqueSolicitudPendiente += '				<div class="row">';
			bloqueSolicitudPendiente += '					<div class="Invalid-Parameter" class="col-md-10 col-md-offset-1 formato-archivos-modal" style="display:none;top:-2em; word-break: break-all;word-wrap: break-word;">';
			bloqueSolicitudPendiente += '						<span class="Invalid-Parameter-file-name"></span>';
			bloqueSolicitudPendiente += '					</div>';
			bloqueSolicitudPendiente += '				</div>';
			bloqueSolicitudPendiente += '				<div class="row">';
			bloqueSolicitudPendiente += '					<div class="button_init">';
			bloqueSolicitudPendiente += '						<button class="init_button button_disable cargar_documentos" productid="' + objSolicitud.id + '" subproductid="' + objSolicitud.subProduct.id + '" onclick="cargarDocumentos(\'' + objSolicitud.id + '\',\'' + objSolicitud.subProduct.id + '\');" disabled="disabled">Subir Documentos</button>';
			bloqueSolicitudPendiente += '					</div>';
			bloqueSolicitudPendiente += '				</div>';
			bloqueSolicitudPendiente += '			</article>';
			bloqueSolicitudPendiente += '		</div>';
			bloqueSolicitudPendiente += '	</div>';
			bloqueSolicitudPendiente += '</div>';
			
		} else {
			log(objSolicitud+': No hay documentos pendientes para esta solicitud.');
		}

	}else{
		//Informacion relacionada con la solicitud pendiente no dada como parametro o sin el formato requerido
		log('::generaBloqueSolicitudPendiente(productRequestChecklist):: Informacion relacionada con la solicitud pendiente no dada como parametro o sin el formato requerido');
	}

	return bloqueSolicitudPendiente;
}

/*
 @brief			Habilita el btn Subir documentos asociados a la solcitud
*/
function habilitaCargarDocumentos(productid,subproductid){

	log('::habilitaCargarDocumentos() init');

	var btnCargarDocumentos = $('.cargar_documentos[productid=' + productid + '][subproductid=' + subproductid + ']');

	if($(btnCargarDocumentos).length == 1){

		if(!$("#Invalid-Parameter").is(':visible')){

			//Valida si es que falta aun algun documento que realizar la carga en el contexto de la solicitud de producto
			var elementosCorrectamenteInformados = true;
			$.each($('.cloudProductRequest[productid=' + productid + '][subproductid=' + subproductid + '] input[type=file]'),function(i,registro){
				if($(registro).val() == ""){
					log('::'+ $(registro).attr('id') + ' elemento no informado.');
					elementosCorrectamenteInformados = false;
				}else{
					//valor ok
					log('::'+ $(registro).attr('id') + ' informado ok');
				}
			});

			log('Valida elementos informados(' + elementosCorrectamenteInformados + ')');
			if(elementosCorrectamenteInformados){
				log('::Procede habilitar el btn para cargar documentos.');
				if($(btnCargarDocumentos).hasClass('button_disable')) $(btnCargarDocumentos).removeClass('button_disable').removeAttr("disabled");
			}else{
				//Falta subir algun documento aun para la solicitud
				log('::Falta subir algun documento aun para la solicitud');
				if(!$(btnCargarDocumentos).hasClass('button_disable')) $(btnCargarDocumentos).addClass('button_disable').attr("disabled","disabled");
			}

		}else{
			//Existe algun error en la carga de algun documento aun informado en la interfaz
			log('::Existe algun error en la carga de algun documento aun informado en la interfaz');
		}

	}else{
		//No existe el boton de carga de documentos asociado a la solicitud a la que se pretenden cargar documentos
		log('::No existe el boton de carga de documentos asociado a la solicitud a la que se pretenden cargar documentos');
	}

}

/*
 @param		obj Checklist
 @format
	"documentAssociatedProductId"               : "11",
	"documentAssociatedProductName"             : "CLOUD",
	"documentAssociatedSubProductId"            : "0005",
	"documentAssociatedSubProductName"          : "INBOX",
 @return	obj Solicitud pendiente
*/
function solicitudPendiente(checklist){
	return {
		id        : checklist.documentAssociatedProductId,
		name      : checklist.documentAssociatedSubProductName,
		subProduct: {
			id    : checklist.documentAssociatedSubProductId,
			name  : checklist.documentAssociatedSubProductName
		}
	};
}

/*
 @brief		Genera el bloque de documentos requeridos a ser subidos en la seccion de subir documentos de hazte cliente
*/
function getBloqueDocumentosRequeridos(checklists){

	log('::getBloqueDocumentosRequeridos:: checklists');
	log(checklists);

	var bloqueDocumentosRequeridos = '';
	
	var documentosPendientes = false;

	if(checklists.length > 0){

		$.each(checklists,function(i,checklist){

			if(checklist.isDocumentExists == true){
				bloqueDocumentosRequeridos += getBloqueExistente(checklist);	//Bloque documento existente(informativo)
			}else{
				bloqueDocumentosRequeridos += getbloquePendiente(checklist);	//Bloque documento pendiente(interactivo)
				documentosPendientes = true;
			}
		});

	}else{
		//Listado de checklists no informado o sin informacion valida
		log('::getBloqueDocumentosRequeridos(checklists):: Listado de checklists no informado o sin informacion valida');
	}
	
	if(documentosPendientes == false){
		bloqueDocumentosRequeridos = '';
	}

	return bloqueDocumentosRequeridos;

}

/*
 @DEPRECATED	Por solicitud D&D siempre al recuperar un error debe mostrarse solicitud exitosa
 @brief			Cierra la modal y redirige al flujo de error envio solicitud
*/
function cerrarModalErrorEnvioSms(){
	$('.formcontent,container_fluid').hide();		//Enconde contenedor principal
	$('#modalErrorEnvioSMS .close-modal').click();	//Dismiss modal
	$('#solicitudError').show();
}

/*
 @brief		Genera un registro de documento existente
*/
function getBloqueExistente(documentosExistente){

	var bloqueExistente = '';

	bloqueExistente += '<div class="row">';
	bloqueExistente += '	<div class="large-6 medium-12 small-12 columns">';
	bloqueExistente += '		<div class="title">'+documentosExistente.documentTypeName.toLowerCase().capitalize()+'</div>';
	bloqueExistente += '		<div class="subtitle">' + documentosExistente.documentTypeShortDescription.toLowerCase().capitalize() + '.</div>';
	bloqueExistente += '	</div>';
	bloqueExistente += '	<div class="large-6 medium-12 small-12 columns">';
	bloqueExistente += '		<div class="form-group" class="checklist-documento-existente"><img class="checklist-documento-cargado" src="fu/img/img-cloud-ticket-green.png"><span class="checklist-existente-imagen">Documento Cargado</span></div>';
	bloqueExistente += '	</div>';
	bloqueExistente += '</div>';
	bloqueExistente += '<hr/>';

	return bloqueExistente;
}

/*
 @brief		Genera un registro de documento pendiente
*/
function getbloquePendiente(documentoPendiente){

	var claveBloque	= documentoPendiente.documentTypeId + documentoPendiente.documentAssociatedProductId + documentoPendiente.documentAssociatedSubProductId;
	//	claveBloque = "FRU110005" Codigo documento + Codigo producto + Codigo Subproducto
	//	Cedula de identidad(FRU), solicitud producto ID(11), subproducto(0005)

	var bloquePendiente = '';

	bloquePendiente += '<div class="row" id="' + claveBloque + '">';
	bloquePendiente += '	<div class="large-6 medium-12 small-12 columns">';
	bloquePendiente += '		<div class="title">'+documentoPendiente.documentTypeName.toLowerCase().capitalize()+'</div>';
	bloquePendiente += '		<div class="subtitle">' + documentoPendiente.documentTypeLongDescription.toLowerCase().capitalize() + '.</div>';
	bloquePendiente += '	</div>';
	bloquePendiente += '	<div class="large-6 medium-12 small-12 columns">';
	bloquePendiente += '		<div class="form-group">';
	bloquePendiente += '			<input id="uploadFile' + claveBloque + '" class="inputTable" placeholder="No hay archivo seleccionado" disabled="disabled">';
	bloquePendiente += '			<button type="button" class="init_button btnTable" onclick="javascript:$(\'#inputUploadFile' + claveBloque + '\').click(); subirDocumentoSeleccionado($(\'#inputUploadFile' + claveBloque + '\'),\'' + documentoPendiente.digitalFolderId + '\')" class="btn btnUpload" multiple accept=".txt,.pdf,application/pdf,text/plain" taxname="' + documentoPendiente.documentTypeShortDescription + '" tipodoc="' + documentoPendiente.documentTypeId + '">';
	bloquePendiente += '				<span  id="btnUploadFile' + claveBloque + '">Buscar</span>';
	bloquePendiente += '			</button>';
	bloquePendiente += '			<input id="inputUploadFile' + claveBloque + '" type="file" class="inputUploadBtn" name="archivo" tipodoc="' + documentoPendiente.documentTypeId + '" taxname="' + documentoPendiente.documentTypeShortDescription + '" productid="' + documentoPendiente.documentAssociatedProductId + '" subproductid="' + documentoPendiente.documentAssociatedSubProductId + '" style="display:none;"/>';
	bloquePendiente += '			<input type="hidden"    class="codigoProducto"   name="codigoProducto"  value="' + documentoPendiente.documentAssociatedProductId + ':' + documentoPendiente.documentAssociatedSubProductId + '"/>';
	bloquePendiente += '			<input type="hidden"    class="idCarpeta"        name="idCarpeta"       value=""/>';
	bloquePendiente += '			<input type="hidden"    class="codEjecutivo"     name="codEjecutivo"    value=""/>';
	bloquePendiente += '			<input type="hidden"    class="taxType"          name="taxType"         value=""/>';
	bloquePendiente += '			<input type="hidden"    class="taxName"          name="taxName"         value=""/>';
	bloquePendiente += '			<input type="hidden"    class="ownerNumber"      name="ownerNumber"     value=""/>';
	bloquePendiente += '			<input type="hidden"    class="ownerCheckDigit"  name="ownerCheckDigit" value=""/>';
	bloquePendiente += '			<input type="hidden"    class="nombreDoc"        name="nombreDoc"       value=""/>';
	bloquePendiente += '		</div>';
	bloquePendiente += '	</div>';
	bloquePendiente += '</div>';
	bloquePendiente += '<hr/>';

	return bloquePendiente;
}

function obtenerEstadisticasSubirDocumentos(listaDocumentos){

	if(typeof listaDocumentos != 'undefined' && listaDocumentos.length>0){

		var cantidadDocumentosCargados   = $.grep(listaDocumentos,function(e){ if(e.codigoRespuesta == "OK"){ return true; }else{ return false; }}).length
		var cantidadDocumentosErroneos   = $.grep(listaDocumentos,function(e){ if(e.codigoRespuesta != "OK"){ return true; }else{ return false; }}).length
		var numeroTotalDeDocumentos      = listaDocumentos.length
		var porcentajeDocumentosCargados = ((numeroTotalDeDocumentos >0) ? (utilsNumber.numberToFormat(((cantidadDocumentosCargados/numeroTotalDeDocumentos)*100),0) + '%') : '0%') + ' completado';

		return {
			cantidadDocumentosCargados   : cantidadDocumentosCargados,
			cantidadDocumentosErroneos   : cantidadDocumentosErroneos,
			numeroTotalDeDocumentos      : numeroTotalDeDocumentos,
			porcentajeDocumentosCargados : porcentajeDocumentosCargados
		}
	}else{
		//parametro listaDocumentos requerido no informado o sin el formato solicitado
		log('::Error: parametro listaDocumentos requerido no informado o sin el formato solicitado');
		return {}
	}

}

/*	@brief		Genera el bloque que despliega los resultados de la operacion de subir documentos hazte cliente cloud
	@test
	var listaDocumentos = [
		{
			"nomArchivo": "CERTIFICADO COTIZ AFP WEB",
			"codigoRespuesta": "OK",
			"descripcionRespuesta": "Archivo subido correctamente."
		}, {
			"nomArchivo": "FOTOCOPIA CEDULA IDENTIDAD WEB",
			"codigoRespuesta": "OK",
			"descripcionRespuesta": "Archivo subido correctamente."
		}, {
			"nomArchivo": "LIQUIDACION SUELDO WEB",
			"codigoRespuesta": "OK",
			"descripcionRespuesta": "Archivo subido correctamente."
		}, {
			"nomArchivo": "VERIFICACION DOMICILIO",
			"codigoRespuesta": "OK",
			"descripcionRespuesta": "Archivo subido correctamente."
		}
	];

*/
function getBloqueResultadoSubirDocumentos(listaDocumentos){

	//Valida logica de acceso ya sea mediante enroll, ya sea mediante completar solicitud
	checklistProductRequest = BBVACloud.enrollNewPerson.listDigitalFolderChecklist.digitalFolderChecklist.length > 0 ? BBVACloud.enrollNewPerson.listDigitalFolderChecklist.digitalFolderChecklist[0].checklists[0] : BBVACloud.continuarSolicitud.listDigitalFolderChecklist.digitalFolderChecklist[0].checklists[0];
	var productRequest = solicitudPendiente(checklistProductRequest);

	$(".informacion-producto").text(productRequest.name.toLowerCase().capitalize());

	var bloqueResultadoSubirDocumentos = '';

	bloqueResultadoSubirDocumentos += '	<div class="tables-body table-scroll">';
	bloqueResultadoSubirDocumentos += '		<form class="result resultBorder">';
	bloqueResultadoSubirDocumentos += '			<table id="tableResult">';
	bloqueResultadoSubirDocumentos += '				<thead>';
	bloqueResultadoSubirDocumentos += '					<tr>';
	bloqueResultadoSubirDocumentos += '						<th>Tipo de documento</th>';
	bloqueResultadoSubirDocumentos += '						<th>Estado</th>';
	bloqueResultadoSubirDocumentos += '					</tr>';
	bloqueResultadoSubirDocumentos += '				</thead>';
	bloqueResultadoSubirDocumentos += '				<tbody>';
													//iteracion sobre conjunto de resultados
													$.each(listaDocumentos,function(i,filaDocumento){
														bloqueResultadoSubirDocumentos += getFilaResultadoSubirDocumentos(filaDocumento);
													});
	bloqueResultadoSubirDocumentos += '				</tbody>';
	bloqueResultadoSubirDocumentos += '			</table>';
	bloqueResultadoSubirDocumentos += '		</form>';
	bloqueResultadoSubirDocumentos += '	</div>';

	$("#contenedorBtnSubirDocumentosMasTarde").hide();
	$("#productRequestsContainer").hide();

	$("#contenido-resultado-upload-document").empty().append(bloqueResultadoSubirDocumentos);
	$("#contenedor-resultado-upload-document").show();

	var estadisticasUpload = obtenerEstadisticasSubirDocumentos(listaDocumentos);
	BBVACloud.informacionCompiladaUploadDocuments = estadisticasUpload;

	//N° documentos subidos
	$("#detalle-upload .detalle-upload-subidos").text(estadisticasUpload.cantidadDocumentosCargados);

	//N° documentos rechazados
	$("#detalle-upload .detalle-upload-rechazados").text(estadisticasUpload.cantidadDocumentosErroneos);

	//N° documentos subidos
	$("#detalle-upload .detalle-porcentaje-valor").text(estadisticasUpload.porcentajeDocumentosCargados);

	var estiloBloqueInformacionResultadoUpload = estadisticasUpload.cantidadDocumentosCargados == estadisticasUpload.numeroTotalDeDocumentos ? 'upload-success' : (estadisticasUpload.cantidadDocumentosCargados == 0 ? 'upload-error' : 'upload-alert');
	$("#mensaje-upload ." + estiloBloqueInformacionResultadoUpload).show();

	processResponseUploadProgressBar('.progress-bar',Math.floor((estadisticasUpload.cantidadDocumentosCargados/estadisticasUpload.numeroTotalDeDocumentos)*100));

}

/*
	@brief			Genera el bloque de resultados del proceso de subida de documentos
	@param			Arreglo de objetos con resultados del proceso
	@format
		[
			{
				"nomArchivo"		  : "CERTIFICADO DE COTIZACIONES DE AFP",
				"codigoRespuesta"	  : "OK",
				"descripcionRespuesta": "Exito"
			},
			{
				"nomArchivo"		  : "BOLETA DE HONORARIOS",
				"codigoRespuesta"	  : "OK"
				"descripcionRespuesta": "Error virus"
			}
		]
*/
function getFilaResultadoSubirDocumentos(resultadoCargaDocumento){

	var filaDocumento = '';

	filaDocumento += '<tr>';
	filaDocumento += '	<td>' + resultadoCargaDocumento.nomArchivo.toLowerCase().capitalize() + '</td>';
	filaDocumento += '	<td><img src="fu/img/' + getEstadoDocumento(resultadoCargaDocumento.codigoRespuesta) + '" class="check-ok" style="margin-right: 10px;height:16px;">' + resultadoCargaDocumento.descripcionRespuesta +  '</td>';
	filaDocumento += '</tr>';

	return filaDocumento;

}

/*
 @brief		Calcula el estado de la subida de un documento en base al codigo de respuesta
*/
function getEstadoDocumento(codigoRespuesta){
	return codigoRespuesta == "OK" ? 'tick-active-small.png' : 'rechazado.svg';
}

/*
 @deprecated
 @brief		Calcula la glosa del estado de la subida de un documento en base al codigo de respuesta
*/
function getGlosaEstadoDocumento(codigoRespuesta){
	return codigoRespuesta == "OK" ? 'Cargado' : 'Error';
}

/*
 @brief		Asigna para ser procesado un archivo
*/
function subirDocumentoSeleccionado(elemento, CarpetaAsociada){

	$(elemento).off().on('change', function handleFileSelect(evt) {

		var selectorCarga	= '#'+ $(elemento).attr('tipodoc') + $(elemento).attr('productid') + $(elemento).attr('subproductid');

		var productid		= $(elemento).attr('productid');
		var subproductid	= $(elemento).attr('subproductid');

		log('::selectorCarga(' + selectorCarga + ')');
		ponerCapaCarga(selectorCarga);

		var uploadFileErrorDescription = '';

		var files = evt.target.files;
		if(typeof files != 'undefined' && files.length > 0){

			//Formato y peso maximo
			if(files[0].size > 3145728){
				uploadFileErrorDescription = 'No se ha cargado el documento '+ files[0].name + ' Revisa si cumple con peso máximo.';
			}

			//Largo nombre archivo
			if(files[0].name.length > 51){
				uploadFileErrorDescription = 'El nombre del documento '+ files[0].name + ' no debe superar los 50 caracteres.';
			}

			//Extension archivo
			if(files[0].type != "application/pdf" && files[0].type != "text/plain" && files[0].type != "image/jpeg"){
				uploadFileErrorDescription = 'No se ha cargado el documento '+ files[0].name + ' Revisa si cumple con el formato requerido.';
			}

		}else{
			//Error generico, no fue cargado evt.target.files tiene largo 0, o no fue informado
			log('::subirDocumentoSeleccionado: Error generico, no fue cargado evt.target.files tiene largo 0, o no fue informado');
		}

		if(files.length > 0 && files[0].size <= 3145728 && (files[0].type == "application/pdf" || files[0].type == "text/plain" || files[0].type == "image/jpeg") && files[0].name.length < 51){

			log('::File debug miscelaneous information');
			log(':: > size: ' + files[0].size + ':: > type: ' + files[0].type + ':: > name: ' + files[0].name + '(L:' + files[0].name.length + ')');

			var reader = new FileReader();

			reader.onload = function(e) {

				var arrayBuffer = reader.result;
				$('#Invalid-Parameter').hide();
				$('#uploadFile' + $(elemento).attr('tipodoc') + $(elemento).attr('productid') + $(elemento).attr('subproductid')).val(files[0].name);
				$('#subir-docs-haztecli').removeAttr('disabled');

				$(elemento).parent().children('.idCarpeta').val(CarpetaAsociada);
				$(elemento).parent().children('.codEjecutivo').val('9999');
				$(elemento).parent().children('.taxType').val($(elemento).attr('tipodoc'));
				$(elemento).parent().children('.taxName').val($(elemento).attr('taxname'));
				$(elemento).parent().children('.ownerNumber').val(utilsNumber.rellenarCeros(getRutNumber(BBVACloud.cliente.rut),9));
				$(elemento).parent().children('.ownerCheckDigit').val(calculateDvr(getRutNumber(BBVACloud.cliente.rut)));
				$(elemento).parent().children('.nombreDoc').val((files[0].name));

			}

			reader.onloadstart = function(e) {
				//$('#progress_bar').addClass('loading');
				//$('#progress_bar').slideDown('slow');
			};

			reader.onprogress = function(evt){

				log('::reader.onprogress:');
				log(evt);

				if (evt.lengthComputable) {
					var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
					if (percentLoaded < 100) {
						log('::percentLoaded: ' + percentLoaded + '%');
					}
				}
			}

			reader.onloadend = function(evt){
				log('::reader.onloadend: quitaCapa de carga');
				quitarCapaCarga(selectorCarga);
			};

			reader.readAsArrayBuffer(files[0]);

			habilitaCargarDocumentos(productid,subproductid);

		}else if(files.length == 0){
			log('::No File selected');
			quitarCapaCarga(selectorCarga);

			//Reinicia los valores configurados

			//Informacion nombre archivo
			$('#uploadFile' + $(elemento).attr('tipodoc') + $(elemento).attr('productid') + $(elemento).attr('subproductid')).val('');

			//Input type file
			$("#inputUploadFile" + $(elemento).attr('tipodoc') + $(elemento).attr('productid') + $(elemento).attr('subproductid')).val('');

			//Campos create dopcument
			$(elemento).parent().children('.idCarpeta').val('');
			$(elemento).parent().children('.codEjecutivo').val('');
			$(elemento).parent().children('.taxType').val('');
			$(elemento).parent().children('.taxName').val('');
			$(elemento).parent().children('.ownerNumber').val('');
			$(elemento).parent().children('.ownerCheckDigit').val('');
			$(elemento).parent().children('.nombreDoc').val('');

			$('#Invalid-Parameter').hide();
			habilitaCargarDocumentos(productid,subproductid);
		}else{

			log('::File debug catched error');

			quitarCapaCarga(selectorCarga);

			//Reinicia los valores configurados

			//Informacion nombre archivo
			$('#uploadFile' + $(elemento).attr('tipodoc') + $(elemento).attr('productid') + $(elemento).attr('subproductid')).val('');

			//Input type file
			$("#inputUploadFile" + $(elemento).attr('tipodoc') + $(elemento).attr('productid') + $(elemento).attr('subproductid')).val('');

			//Campos create dopcument
			$(elemento).parent().children('.idCarpeta').val('');
			$(elemento).parent().children('.codEjecutivo').val('');
			$(elemento).parent().children('.taxType').val('');
			$(elemento).parent().children('.taxName').val('');
			$(elemento).parent().children('.ownerNumber').val('');
			$(elemento).parent().children('.ownerCheckDigit').val('');
			$(elemento).parent().children('.nombreDoc').val('');

			$('#Invalid-Parameter-file-name').html(getBloqueHtmlError(uploadFileErrorDescription));
			$('#Invalid-Parameter').show();

			habilitaCargarDocumentos(productid,subproductid);

		}

		return false;

	});
}

function getBloqueHtmlError(msg) {

	var html = '<p class="cloud-block-error">';
		html += '<img src="fu/img/cloud-alerta-subir-documentos.png" style="float:left"/>';
		html += '<span>' + msg + '</span>';
		html += '</p>';
	return html;
}

function cargarDocumentos(productId, subProductId){

	$(".formularioSolicitudPendiente").off().submit(function (event) {

		event.preventDefault();

		var form        = $(this);
		var productid   = $(this).attr('productid');
		var subproductid= $(this).attr('subproductid');

		log("formularioSolicitudPendiente submit::init::");
		log("::productid: " + productid);
		log("::subproductid: " + subproductid);

		var formData = new FormData($('.formularioSolicitudPendiente[productid=' +  productid + '][subproductid=' + subproductid + ']')[0]);

		//Init progress bar selector
		log('::cargarDocumentos >> formularioSolicitudPendiente submit >> Init progress bar selector');
		initResponseUploadProgressBar('.progress-bar');

		$.ajax({
			url        : '/FUBBVAform/uploadDocument',
			type       : 'post',
			data       : formData,
			async      : true,
			dataType   : 'json',
			cache      : false,
			contentType: false,
			processData: false,
			success    : function (json) {

				BBVACloud.responseUploadDocuments = json.responseUploadDocuments;

				if(BBVACloud.responseUploadDocuments != null && typeof BBVACloud.responseUploadDocuments == 'object' && !$.isEmptyObject(BBVACloud.responseUploadDocuments)){

					getBloqueResultadoSubirDocumentos(BBVACloud.responseUploadDocuments.documentos);

				}else{
					//Error en el proceso general de carga de documentos
					log('::Error en el proceso general de carga de documentos');
					processResponseUploadProgressBar('.progress-bar',0);
				}
			},
			error      : function(request,textStatus,thrownError){

				//processResponseUploadProgressBar('.progress-bar',0);

				log('::::formularioSolicitudPendiente:: Error al tratar de recuperar la respuesta. Respuesta no existe o sin el formato valido');
				log(request);
				log(textStatus);
				log(thrownError);

				//Por solicitud de D&D se redirige a solicitud enviada exitosamente
				terminarSolcitudUpload();

			},
			complete   : function(){
				log('::Documents processed, processing progress bar.');
				processResponseUploadProgressBar('.progress-bar',0);
			}
		});

		log("formularioSolicitudPendiente submit ::end::");

	});

	$('.cloudProductRequest[productid=' + productId + '][subproductid=' + subProductId + '] input[type=submit]').click();
}

//'.progress'
function initResponseUploadProgressBar(progressbarSelector){
	$(progressbarSelector).height(10).progressbar({ value : false });
}

//'.progress'
function processResponseUploadProgressBar(progressbarSelector,percentLoaded){

	$(progressbarSelector).progressbar({ value : false });

	var displayInterval = true;
	var intervalCount = 1;
	var progressInterval = setInterval(function(){
		if(displayInterval) {
			$(progressbarSelector).progressbar({ value : intervalCount });
			intervalCount+=1;
		}

		if(intervalCount>percentLoaded){
			$(progressbarSelector).progressbar({ value : 100 });
			displayInterval = false;
			clearInterval(progressInterval);

			if(percentLoaded != 100){
				$(progressbarSelector).removeClass('progress-success');	//	!=100%
				if(percentLoaded>0){
					$(progressbarSelector).addClass('progress-alert');	//	]0-99%[
				}else{
					$(progressbarSelector).addClass('progress-danger');	//	0%
				}
			}
		}
	}, 25);
}
