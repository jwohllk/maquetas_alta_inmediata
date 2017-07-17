/**
* @fileoverview Espacio de trabajo de Nectia para 'Alta inmediata'
* @author Jurgen Wohllk <jwohllk@nectia.com>
* @version 0.1.0 
*/

var ntAltaInmediataAjaxRequests = (function() {

    //SERVICIO QUE RETORNA LAS PREGUNTAS DE EQUIFAX QUE SE HARAN AL USUARIO
    function getEquifaxQuestions(dataService) {

        var urlService = "http://93.16.237.8/FUBBVARutAPI/getQuestions";

        var data = {};      

        $.ajax({
            url: urlService,
            type: "POST",
            data: JSON.stringify(dataService),
            dataType: "json",
            contentType : "application/json; charset=utf-8",
            async: false,
            success: function(json) {
                if(json.code == "00") {
                    ntAltaInmediataEquifaxController.loadQuestions(json);
                    data = json;
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                console.log('Hubo un error al recuperar las preguntas');
            }
        });

        return data;
    } 

    //SERVICIO ANALISA LAS RESPUESTAS QUE CONTESTO EL USUARIO PARA EQUIFAX
    function validateEquifaxAnswers(dataService, rut) {

        var urlService = "http://93.16.237.8/FUBBVARutAPI/validateAnswers/"+ rut +"?authorizedPrevired=true";

        var data = {};

        $.ajax({
            url: urlService,
            type: "POST",
            data: JSON.stringify(dataService),
            dataType: "json",
            contentType : "application/json; charset=utf-8",
            async: false,
            success: function(json) {
                if(json.code == "00") {
                    data = json;
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                console.log('Hubo un error al validar las respuestas');
            }
        });

        return data;
    }

    return {
        getEquifaxQuestions : getEquifaxQuestions,
        validateEquifaxAnswers : validateEquifaxAnswers
    };

})();

//ESPACIO DE TRABAJO PARA LA PARTE DE PREGUNTAS Y VALIDACION DE EQUIFAX

var ntAltaInmediataEquifaxController = (function() {

    /* FUNCIONES EQUIFAX */

    //metodo que carga las preguntas en el DOM
    function loadQuestions(dataQuestions) {
        //contenedor de todas las preguntas que hay en el formulario de equifax
        var $container = $('.equifaxQuestions');
        //recorremos el array con los objeto pregunta alternativas
        var questionsArray = [];
        

        $.each(dataQuestions.object.questionAnswers, function(index,question){

            //creamos el contenedor de preguntas
            var $question_container = $("<div></div>", {'id':'question_container'+(question.number), 'class' : "small-12 medium-12 large-6 column margin_input_form questionContainer"});
            //creamos el parrafo que contendra la pregunta
            var $question = $("<label></label>", {'id':"questionTitle"+(question.number), "class":"questionTitle"});
            //select input
            var $select = $("<select></select>", {'id':"question"+(question.number), "class":"questionSelect", "name" : "question"+(question.number)});
            $select.append('<option value="">Seleccione</option>');
            //
            var $alternatives = $('<div></div>', {'id' : "alternatives"+(question.number), 'class' : 'alternatives'});

            //seteamos el texto que contendra el parrafo
            $question.text(question.description+"*");
            //agregamos la pregunta al contenedor de pregunta
            $question_container.append($question);
            //declaramos el contador para saber cual dato debemos mostrar en pantalla
            var counter = 0;

            $.each(question.alternatives, function(indexAlternatives,itemAlternative){
                //insertamos en el contenedor de alternativa el radiobutton con la informacion necesaria
                $select.append('<option value="'+itemAlternative.number+'">'+itemAlternative.description+'</option>');
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

    // funcion que se hace en reemplazo de flex-box debido al poco soporte que tiene para navegadores antiguos, lo que hace es poner el mismo height para las preguntas por cada fila que se genera (2 preguntas) asi los select quedan alineados si la 1 pregunta es corta y la 2 es larga
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

    //valida que se ingrese un numero de telefono
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

    //muestra el estilo error
    function showFieldError(field) {
        $(field).addClass("error-input");
    }

    //quita el estilo de error al input
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

    //verifica que el terminos y condiciones se checkee
    function validateTermConditions(field) {
        if(!$(field).is(':checked')) {
            $('.acceptTermConditions').show();
            return false;
        }
        $('.acceptTermConditions').hide();
        return true;
    }

    /* FIN VALIDACION DE FORMULARIO EQUIFAX */

    function questionSelectInit() {
        $.each($('.questionSelect'), function(index,item){
            $("#question"+(index+1)).selectmenu({
                change : function(event, ui) {
                    //ntAltaInmediata.validateFieldMenu("#question"+(index+1)+"-button");
                },
                focus : function(event, ui) {
                    clearFieldErrorMenu("#question"+(index+1)+"-button");
                }
            });
        }); 
    }


    function continueEquifax(questionsData, rut) {
        $('#continueEquifax').click(function() {
            //logica para saber si el formulario viene con errores
            var formError = false;
            $.each($('.questionSelect'), function(index,item){
                if(!validateFieldMenu("#question"+(index+1)+"-button")) {
                    formError = true;
                }
            });
            if($('#phoneField').length > 0) {
                if(!validatePhoneField("#phoneField")) {
                    formError = true
                }
            } else {
                formError = true;
            }
            
            if(!validateTermConditions('#termConditions')) {
                formError = true
            }

            //si viene todo correcto
            if(!formError) {
                //armamos el array con las respuestas que contesto la persona
                var answers = [];
                $.each($('.questionSelect'), function(index,item){
                    answers.push(
                        {
                            "number": ""+(index+1),
                            "alternatives": [
                                {
                                    "number": parseInt($("#question"+(index+1)).val())
                                }
                            ]
                        }
                    );
                });         

                //generamos la variable que se enviara por POST al servicio de equifax validateAnswers
                var dataPostAnswerValidation = {
                    "equifaxCustomerAuthentication": {
                        "transactionKey": questionsData.object.equifaxCustomerAuthentication.transactionKey
                    },
                    "questionAnswers": answers
                };

                var validateAnswersData = ntAltaInmediataAjaxRequests.validateEquifaxAnswers(dataPostAnswerValidation, rut);
                
                if(validateAnswersData.code == "00" && validateAnswersData.object.isValid) {
                    console.log(validateAnswersData.object.transactionKey, 'Respuestas Correctas');
                } else {
                    console.log('Respuestas invalidas');
                }
            } else {
                console.log('Respuestas no contestadas')
            }
        });
    }

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
        questionSelectInit : questionSelectInit,
        continueEquifax : continueEquifax
    }

})();


$(document).ready(function() {

    var dataService = {
        rut: "251103429",
        numeroSerie: "200834613"
    };

    // llamamos al servicio que obtiene las preguntas (y llama al servicio que renderiza el html) retorna la respuesta del servicio
    // para el posterior uso del token
    var questionsData = ntAltaInmediataAjaxRequests.getEquifaxQuestions(dataService);

    // init a los select de este formulario preguntas equifax (para que se vean con el estilo de jquery UI select)
    ntAltaInmediataEquifaxController.questionSelectInit();

    //validacion de formulario y consulta al servicio de validacion de respeustas
    ntAltaInmediataEquifaxController.continueEquifax(questionsData, dataService.rut);

    $(window).resize(function() {
      //acomoda el tamaño de las respuestas responsivamente
      ntAltaInmediataEquifaxController.resizeQuestions();
    });

    //para que el input de telefonos acepte solo numeros
    ntAltaInmediataEquifaxController.onlyNumbers('#phoneField');
    
});

// var dataQuestions = [
//  {
//      'number' : 1,
//      'description' : 'Cual es su apellido materno',
//      'alternatives': [
//          {
//              'number' : 1,
//              'description' : 'IBARRA',
//          },
//          {
//              'number' : 2,
//              'description' : 'GONZALEZ',
//          },
//          {
//              'number' : 3,
//              'description' : 'PEREZ',
//          },
//          {
//              'number' : 4,
//              'description' : 'GALAZ'
//          },
//          {
//              'number' : 5,
//              'description' : 'GALAZ'
//          }
//      ]       
//  },
//  {
//      'number' : 2,
//      'description' : 'Cual es su apellido paterno',
//      'alternatives': [
//          {
//              'number' : 1,
//              'description' : 'WOHLLK',
//          },
//          {
//              'number' : 2,
//              'description' : 'OSSES',
//          },
//          {
//              'number' : 3,
//              'description' : 'GALINDO',
//          },
//          {
//              'number' : 4,
//              'description' : 'DURAN'
//          },
//          {
//              'number' : 5,
//              'description' : 'GALAZ'
//          }
//      ]       
//  },
//  {
//      'number' : 3,
//      'description' : 'De que marca es su auto',
//      'alternatives': [
//          {
//              'number' : 1,
//              'description' : 'MAZDA',
//          },
//          {
//              'number' : 2,
//              'description' : 'NISSAN',
//          },
//          {
//              'number' : 3,
//              'description' : 'CHEVROLET',
//          },
//          {
//              'number' : 4,
//              'description' : 'GREAT WALL'
//          },
//          {
//              'number' : 5,
//              'description' : 'TOYOTA'
//          }
//      ]       
//  },
//  {
//      'number' : 4,
//      'description' : 'Cual es su banco',
//      'alternatives': [
//          {
//              'number' : 1,
//              'description' : 'ITAU',
//          },
//          {
//              'number' : 2,
//              'description' : 'SANTANDER',
//          },
//          {
//              'number' : 3,
//              'description' : 'BBVA',
//          },
//          {
//              'number' : 4,
//              'description' : 'CHILE'
//          },
//          {
//              'number' : 5,
//              'description' : 'ESTADO'
//          }
//      ]       
//  },
//  {
//      'number' : 5,
//      'description' : 'Cuantos hijos tiene',
//      'alternatives': [
//          {
//              'number' : 1,
//              'description' : 'UNO',
//          },
//          {
//              'number' : 2,
//              'description' : 'TRES',
//          },
//          {
//              'number' : 3,
//              'description' : 'CINCO',
//          },
//          {
//              'number' : 4,
//              'description' : 'DOS'
//          },
//          {
//              'number' : 5,
//              'description' : 'NO TENGO HIJOS'
//          }
//      ]       
//  }
// ];