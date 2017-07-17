/**
* @fileoverview Espacio de trabajo de Nectia para 'Alta inmediata'
* @author Jurgen Wohllk <jwohllk@nectia.com>
* @version 0.1.0 
*/

var ntAltaInmediata = (function() {

	/* LLAMADAS AJAX */

	function getEquifaxQuestions(url, data) {
        //LLAMAMOS A LA FUNCION QUE NOS RETORNA LAS PREGUNTAS DE EQUIFAX
        $.ajax({
            url: '?AID=SERVICIO_PREGUNTAS_EQUIFAX',
            type: "get",
            data: { "rutCliente" : data},
            dataType: "json",
            async: false,
            success: function(json) {
            	//logica success
            },
            error:function (xhr, ajaxOptions, thrownError) {
                //logica de error
            }
        });
    } 

    function sendEquifaxQuestions(url, data) {
        //LLAMAMOS A LA FUNCION QUE ENTREGA LAS RESPUESTAS A EQUIFAX
        $.ajax({
            url: '?AID=SERVICIO_RESPUESTAS_EQUIFAX',
            type: "get",
            data: { "respuestas" : data},
            dataType: "json",
            async: false,
            success: function(json) {
            	//logica success
            },
            error:function (xhr, ajaxOptions, thrownError) {
                //logica de error
            }
        });
    }

    /* FIN LLAMADAS AJAX */

	/* FUNCIONES EQUIFAX */

	//metodo que carga las preguntas en el DOM
	function loadQuestions() {
		//contenedor de todas las preguntas que hay en el formulario de equifax
		var $container = $('.equifaxQuestions');
		//recorremos el array con los objeto pregunta alternativas
		var questionsArray = [];
		$.each(dataQuestions, function(index,item){

			//creamos el contenedor de preguntas
			var $question_container = $("<div></div>", {'id':'question_container'+(index+1), 'class' : "small-12 medium-12 large-6 column margin_input_form questionContainer"});
			//creamos el parrafo que contendra la pregunta
			var $question = $("<label></label>", {'id':"questionTitle"+(index+1), "class":"questionTitle"});
			//select input
			var $select = $("<select></select>", {'id':"question"+(index+1), "class":"questionSelect", "name" : "question"+(index+1)});
			$select.append('<option value="">Seleccione</option>');
			//
			var $alternatives = $('<div></div>', {'id' : "alternatives"+(index+1), 'class' : 'alternatives'});

			//seteamos el texto que contendra el parrafo
			$question.text("¿"+item.questionDescription+"*?");
			//agregamos la pregunta al contenedor de pregunta
			$question_container.append($question);
			//declaramos el contador para saber cual dato debemos mostrar en pantalla
			var counter = 0;

			$.each(item, function(indexAlternatives,itemAlternative){
				
				//subimos el contador en 1
				counter++;
				//si el contador es mayor a 2 (los datos 1 y 2 corresponden al numero de pregunta y descripcion de la pregunta, del 3 en adelante son numero de alternativa y descripcion de la alternativa )
				if(counter > 2) {
					//con esto definimos la pregunta que se hara porque los datos impares son los numeros de pregunta y no su descripción
					if((counter%2) == 0) {
						//definimos el contenedor de la alternativa
						
						//insertamos en el contenedor de alternativa el radiobutton con la informacion necesaria
						$select.append('<option value="'+itemAlternative+'">'+itemAlternative+'</option>');
						//insertamos en el contenedor de pregunta la alternativa
						
					}
				}
			});
			$alternatives.append($select);
			$question_container.append($alternatives);

			questionsArray.push($question_container);

		});
		//esta parte es para que 2 preguntas vayan dentro de 1 row
		$.each(questionsArray, function(index, item) {
			if((index + 1) % 2  == 0 && index != 0 && questionsArray.length > 1) {
				$question_container_row = $("<div></div>", {'class' : "row questionsRow"});
				$question_container_row.append(questionsArray[index-1]);
				$question_container_row.append(questionsArray[index]);
				//Insertamos en el contenedor el contenedor de pregunta
				$container.append($question_container_row);
			}
		});

		//para cuando las preguntas son impares 
		if((questionsArray.length % 2 == 1) || questionsArray.length == 1 ) {
			// creamos la fila y le agregamos la ultima pregunta
			var $question_container_row = $("<div></div>", {'class' : "row questionsRow"});	
			$question_container_row.append(questionsArray[questionsArray.length-1]);

			generatePhoneInput();		
		} else {
			generatePhoneInput();
		}

		function generatePhoneInput() {
			// creamos el contenedor de preguntas
			var $question_container = $("<div></div>", {'id':'question_container'+(questionsArray.length+1), 'class' : "small-12 medium-12 large-6 column margin_input_form questionContainer"});
			
			//definimos el titulo de la pregunta
			$question = $("<label></label>", {'id':"questionTitle"+(questionsArray.length + 1), "class":"questionTitle"});
			$question.text("Ingresa tu teléfono móvil*");
			//select input
			$question_container.append($question);

			//definimos el input que se utilizara
			var $input = $("<input></input>", {'id':"phoneField", "class":"questionInput", "name" : "phoneField", 'type' : 'text', 'maxlength' : '9', 'placeholder' : 'Ej: 912345678'});

			//agregamos al contenedor
			$question_container.append($input);

			$question_container_row.append($question_container);

			$container.append($question_container_row);
		}

		resizeQuestions();
	}

	//funcion que se hace en reemplazo de flex-box debido al poco soporte que tiene para navegadores antiguos, lo que hace es poner el mismo height para las preguntas por cada fila que se genera (2 preguntas) asi los select quedan alineados si la 1 pregunta es corta y la 2 es larga
	function resizeQuestions() {
		var counter = 1;
		$('.questionsRow').each(function () {
			var maxHeight = 0;
			$(this).find('.questionTitle').each(function () {
				var title = $(this).text();
				var $questionContainer = $(this).parent();
				var $title = $("<label></label>", {'id':"questionTitle"+(counter), "class":"questionTitle"});
				$($title).text(title);
				$(this).remove();
				$($questionContainer).prepend($title);
		        maxHeight = Math.max($($title).height(), maxHeight);
		        counter++;
		    });
		    if (window.matchMedia('screen and (min-width: 769px)').matches) {
		    	$(this).find('.questionTitle').height(maxHeight);
			}
		});
	}

	/* VALIDACION DE FORMULARIO EQUIFAX */
	function validateFieldMenu(field) {
		if ($(field).text() === "Seleccione") {
			showFieldErrorMenu(field);
			$(field).attr("title","Seleccione una alternativa");
			return false;
		}
		$(field).removeClass("ui-selectmenu-error");
		$(field).removeAttr("title");
		return true;
	}

	//funcion que agrega el error al campo
	function showFieldErrorMenu(field) {
		$(field).addClass("ui-selectmenu-error");
	}

	//funcion que remueve el error del campo
	function clearFieldErrorMenu(field) {
		$(field).removeAttr("title");
		$(field).removeClass("ui-selectmenu-error");
	}

	function validatePhoneField(field) {
		var val = trimFieldValue(field);
		//isValidPhone viene de utils_fu.js
		if (val === "" || !isValidPhone(val)) {
			showFieldError(field);
			$(field).attr("title","Ingresa tu teléfono móvil");
			return false;
		}
		clearFieldError(field);
		return true;
	}

	function showFieldError(field) {
		$(field).addClass("error-input");
	}

	function clearFieldError(field) {
		$(field).removeAttr("title");
		$(field).removeClass("error-input");
	}

	//funcion que no permite ingresar letras al campo
	function onlyNumbers(field) {
		$(field).keypress(function(event) {
			if (!isMinControlChar(event.which) && !isNumberChar(event.which)) {
				event.preventDefault();
			}
		});
	}

	function validateTermConditions(field) {
		if(!$(field).is(':checked')) {
			$('.acceptTermConditions').show();
			return false;
		}
		$('.acceptTermConditions').hide();
		return true;
	}

	/* FIN VALIDACION DE FORMULARIO EQUIFAX */

	/* FIN FUNCIONES EQUIFAX */

	return {
		loadQuestions : loadQuestions,
		resizeQuestions : resizeQuestions,
		showFieldErrorMenu : showFieldErrorMenu,
		clearFieldErrorMenu : clearFieldErrorMenu,
		validateFieldMenu : validateFieldMenu,
		onlyNumbers : onlyNumbers,
		validateTermConditions : validateTermConditions,
		validatePhoneField : validatePhoneField,
		getEquifaxQuestions : getEquifaxQuestions,
		sendEquifaxQuestions : sendEquifaxQuestions
	}

})();


$(document).ready(function() {

	ntAltaInmediata.loadQuestions();

	$.each($('.questionSelect'), function(index,item){
		$("#question"+(index+1)).selectmenu({
			change : function(event, ui) {
				//ntAltaInmediata.validateFieldMenu("#question"+(index+1)+"-button");
			},
			focus : function(event, ui) {
				ntAltaInmediata.clearFieldErrorMenu("#question"+(index+1)+"-button");
			}
		});
	});	

	$('#continueEquifax').click(function() {
		$.each($('.questionSelect'), function(index,item){
			ntAltaInmediata.validateFieldMenu("#question"+(index+1)+"-button");
		});
		//validatePhoneField viene de utils_fu.js
		ntAltaInmediata.validatePhoneField("#phoneField");
		ntAltaInmediata.validateTermConditions('#termConditions');
	});

	$(window).resize(function() {
	  //resize just happened, pixels changed
	  ntAltaInmediata.resizeQuestions();
	});

	ntAltaInmediata.onlyNumbers('#phoneField');
	
});

var dataQuestions = [
	{
		'questionNumber' : 1,
		'questionDescription' : 'Cual es el apellido materno',
		'alternative1' : 1,
		'alternative1Desripcion' : 'IBARRA',
		'alternative2' : 2,
		'alternative2Desripcion' : 'GONZALEZ',
		'alternative3' : 3,
		'alternative3Desripcion' : 'PEREZ',
		'alternative4' : 4,
		'alternative4Desripcion' : 'GALINDO',
		'alternative5' : 5,
		'alternative5Desripcion' : 'GALAZ'
	},
	{
		'questionNumber' : 2,
		'questionDescription' : 'Como se llama tu madre',
		'alternative1' : 1,
		'alternative1Desripcion' : 'AURORA',
		'alternative2' : 2,
		'alternative2Desripcion' : 'MARIA',
		'alternative3' : 3,
		'alternative3Desripcion' : 'TERESA',
		'alternative4' : 4,
		'alternative4Desripcion' : 'SOFIA',
		'alternative5' : 5,
		'alternative5Desripcion' : 'CAMILA'
	},
	{
		'questionNumber' : 3,
		'questionDescription' : 'Cual es el nombre de tu padre',
		'alternative1' : 1,
		'alternative1Desripcion' : 'PEDRO',
		'alternative2' : 2,
		'alternative2Desripcion' : 'FREDDY',
		'alternative3' : 3,
		'alternative3Desripcion' : 'MATIAS',
		'alternative4' : 4,
		'alternative4Desripcion' : 'GUSTAVO',
		'alternative5' : 5,
		'alternative5Desripcion' : 'HECTOR'
	},
	{
		'questionNumber' : 4,
		'questionDescription' : 'En que ciudad naciste',
		'alternative1' : 1,
		'alternative1Desripcion' : 'LA SERENA',
		'alternative2' : 2,
		'alternative2Desripcion' : 'SANTIAGO',
		'alternative3' : 3,
		'alternative3Desripcion' : 'PUERTO MONTT',
		'alternative4' : 4,
		'alternative4Desripcion' : 'PUNTA ARENAS',
		'alternative5' : 5,
		'alternative5Desripcion' : 'RANCAGUA'
	},
	{
		'questionNumber' : 5,
		'questionDescription' : 'Cual es tu banco',
		'alternative1' : 1,
		'alternative1Desripcion' : 'SANTANDER',
		'alternative2' : 2,
		'alternative2Desripcion' : 'BBVA',
		'alternative3' : 3,
		'alternative3Desripcion' : 'SCOTIABANK',
		'alternative4' : 4,
		'alternative4Desripcion' : 'CHILE',
		'alternative5' : 5,
		'alternative5Desripcion' : 'BCI'
	}
];