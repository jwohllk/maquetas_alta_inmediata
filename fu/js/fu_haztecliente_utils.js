window.logError = function (param) {
	var now = new Date();
	var timestamp = utilsNumber.rellenarCeros(now.getHours(),2) + ":" + utilsNumber.rellenarCeros(now.getMinutes(),2) + ":" + utilsNumber.rellenarCeros(now.getSeconds(),2);

	log.history = log.history || []; // store logs to an array for reference
	log.history.push(arguments);
	if (this.console) {
		if (console.error) {
			console.error(timestamp.toString(), arguments.length == 1 ? arguments[0] : arguments);
		} else if (console.log) {
			console.log(timestamp.toString(), arguments.length == 1 ? arguments[0] : arguments);
		}
	} else {
		//alert( timestamp.toString()+Array.prototype.slice.call(arguments) );
	}
};

window.log = function () {
	var now = new Date();
	var timestamp = utilsNumber.rellenarCeros(now.getHours(),2) + ":" + utilsNumber.rellenarCeros(now.getMinutes(),2) + ":" + utilsNumber.rellenarCeros(now.getSeconds(),2);

	log.history = log.history || []; // store logs to an array for reference
	log.history.push(arguments);
	if (this.console) {
		if (console.log) {
			console.log(timestamp.toString(), arguments.length == 1 ? arguments[0] : arguments);
		}
	} else {
		//alert( timestamp.toString()+Array.prototype.slice.call(arguments) );
	}
};

// Rescata el primer elemento de un arreglo
if (!Array.prototype.first) {
	Array.prototype.first = function () {
		return this[0];
	};
}

function fixSelector(selector) {
	if (typeof selector == "string") {
		if (selector.charAt(0) != "#" && selector.charAt(0) != ".") {
			return "#" + selector;
		}
	}
	return selector;
}

function ponerCapaCarga(selector) {
	log("loader capaCarga");
	selector = fixSelector(selector); // Caso se invoca a la funcion sin el selector jQuery que indica Id (#)
	if ($(selector).length !== 0 && $(selector).find('#loader').length === 0) {
		log("loader capaCarga :: if");
		var loader = '<div id="loader"><div class="cover">&nbsp;</div><div class="spinner"><center><img src="fu/img/loader.gif" alt="loader"/></center></div></div>';
		log("loader capaCarga carga el loader");
		$(selector).append(loader);
		log("loader capaCarga :: ejecuta el selector");
	}
}

function quitarCapaCarga(selector) {
	selector = fixSelector(selector); // Caso se invoca a la funcion sin el selector jQuery que indica Id (#)
	if (selector) {
		while ($(selector).find('#loader').length !== 0) {
			$(selector).find('#loader').remove();
		}
	} else {
		while ($('#loader').length !== 0) {
			$('#loader').remove();
		}
	}
}

/*
 @brief			Posiciona la interfaz a la altura del elemento suministrado con el parametro elementID
 @test			transitionTo('facade');		//default
 @test			transitionTo('step_one');
*/
function transitionTo(elementId){
	setTimeout(function() {
		$('html,body', window.parent.document).animate({ scrollTop : $('#' + elementId, window.parent.document).height().top + $('header').height() }, 'slow'), 500
	},500);
}

/*
@brief		Capitaliza un string
 */
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

//Controles de entrada solo numerica(0-9)
$(document).on("input", ".entrada-numerica", function() {
    this.value = this.value.replace(/[^\d]/g,'');
});

//Controles de entrada alfanumerica(a-zA-Z0-9)
$(document).on("input", ".entrada-alfanumerica", function() {
    this.value = this.value.replace(/[^a-zA-Z\d]/g,'');
});

//Controles de entrada alfabetica(a-zA-Z)
$(document).on("input", ".entrada-alfabetica", function() {
    this.value = this.value.replace(/[^a-zA-z\s\u00F1\u00D1]|\\|\[|\]|_|\u005E|\u0060/g,'');
});

$("#numeroSerieCedula").on('change', function(evt){
	$(this).attr("title", "");
	$(this).removeClass("error-input");
});

//Campos nativos de formulario unico
$("#divCamposBasicosRequeridos input[type=text]").on( "keydown", function(event) { habilitaBotonEnviaSolicitud(); } );		//Campos de entrada de texto, albanumericos, y numericos
$("#divCamposBasicosRequeridos #field-email").on( "keydown", function(event) { habilitaBotonEnviaSolicitud(); } );		//Campos de entrada de texto, albanumericos, y numericos
$("#divCamposBasicosRequeridos .select_").on( "selectmenuchange", function(event, ui) { habilitaBotonEnviaSolicitud(); } );	//Campos de seleccion(selectmenu)

//Campos hazte cliente cloud
$("#files input[type=text]").on( "keydown", function(event) { habilitaBotonEnviaSolicitud(); } );		//Campos de entrada de texto, albanumericos, y numericos
$("#files .select_").on( "selectmenuchange", function(event, ui) { habilitaBotonEnviaSolicitud(); } );	//Campos de seleccion(selectmenu)


function configuraSelectorNacionalidad(lstPaises){

	$('#lb_nacionalidad').empty().append('<option value="">Selecciona tu nacionalidad</option>');

	$.each(lstPaises,function(i,pais){
		$('#lb_nacionalidad').append('<option value="' + pais.codigo +'">' + pais.glosa + '</option>');
	});

	$('#lb_nacionalidad').selectmenu();
}

//Habilita el inicio
function habilitaBotonComenzarSolicitud(){

	setTimeout(function(){
		if(validaCamposEntradaFormulario()){
			$("#next_zero").removeClass('btn-secondary button_disable').removeAttr('disabled').attr('onclick','enviarSolicitudHazteCliente();');
		}else{
			$("#next_zero").addClass('btn-secondary button_disable').attr('disabled','disabled').attr('onclick','return false;');
		}
	},500);
}

function habilitaBotonEnviaSolicitud(){

	setTimeout(function(){
		if(validaCamposEntradaFormulario()){
			$("#confirmaAvanzaHazteCliente").removeClass('btn-secondary button_disable').removeAttr('disabled').attr('onclick','enviarSolicitudHazteCliente();');
		}else{
			$("#confirmaAvanzaHazteCliente").addClass('btn-secondary button_disable').attr('disabled','disabled').attr('onclick','return false;');
		}
	},10);
}

function validaCamposEntradaFormulario(){

	log('::validaCamposEntradaFormulario ::init::');

	if($("#files").is(':visible')){

		log('::Deben ser validados los campos relacionados con los Datos complementarios.');
		
		if($("#fnac_dd").is(':focus') || $("#fnac_mm").is(':focus') || $("#fnac_aaaa").is(':focus')){
			return false;
		}

		if($("#dc_nombre").val()== ""){
			return false;
		}
		
		if($("#dc_apellidos").val()== "" || $("#dc_apellidos").val().trim().includes(" ") == false){
			return false;
		}
		
		if($("#dc_calle").val()== ""){
			return false;
		}//Calle

		if($("#dc_calle_numero").val()== ""){
			return false;
		}//Calle numero

		/*
		if($("#ui-id-1").val()== ""){
			return false;
		}

		if($("#tipo_numero").val()== ""){
			return false;
		}
		*/

		if($("#numeroSerieCedula").val()== ""){
			return false;
		}//Serie cedula

		if($("#lb_civ_sta").val()== ""){
			return false;
		}//Estado civil

		if($("#fnac_dd").val()== ""){
			return false;
		}//Fecha nacimiento dd-mm-aaaa

		if($("#fnac_mm").val()== ""){
			return false;
		}

		if($("#fnac_aaaa").val()== ""){
			return false;
		}

		if($("#lb_nacionalidad").val()== ""){
			return false;
		}//Nacionalidad

		return validaCamposFormularioUnico();

	}else{

		log('::No deben ser validados los campos relacionados con los Datos complementarios.');
		return validaCamposFormularioUnico();

	}

}

/*
 @brief		Valida los campos nativos de formulario unico
*/
function validaCamposFormularioUnico(){

	log('::validaCamposFormularioUnico() ::init::');

	//lb_phone
	if($("#lb_phone").val() == ""){
		return false;
	}

	if($("#field-email").val() == ""){
		return false;
	}

	if($("#region").val() == ""){
		return false;
	}

	if($("#comuna").val() == ""){
		return false;
	}

	return true;

}

function validaNumeros(e){
    tecla = (document.all) ? e.keyCode : e.which;

    if (tecla==8){
        return true;
    }

    patron =/[0-9]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

function validaNumerosSerie(e){
    tecla = (document.all) ? e.keyCode : e.which;

    if (tecla==8 || tecla==65 || tecla==97){
        return true;
    }

    patron =/[0-9]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

function validaInformacionGenero(){
	return $('input[type=radio].css-checkbox:checked+label.css-label, input[type=radio].css-checkbox+label.css-label.chk').attr('for') == 'Femenino' ? 'F' : 'M'
}