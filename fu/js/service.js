/**/
/*Archivo donde se consumen los servicios expuestos y procesa la información que devuelve el servidor*/

com.bbva.service = com.bbva.service || {};

com.bbva.service.Service = (function(wd, document) {

	// var URL_SERVICE = "http://82.255.145.46:9080/OpeningAccountWeb/jaxrs",
	// service = null;
	var URL_SERVICE = "jaxrs", service = null;

	return {
		/* Métodos públicos */

		/*
		 * Realizán peticiones al servidor mediante un verbo (GET, POST), cada
		 * petición tiene un sub url y parámetros, dichos parámetros pueden ser
		 * valores que deben ser envíados al servidor y/o funciones , como por
		 * ejemplo "processData", que es la función que se envía y procesa la
		 * información
		 */

		getDetailsByOffice : function(idSelect, idLabel, code, processData) {
			service = this;
			if (code == "" || code == "undefined") {
				return false;
			}
			$('#sp_wait').show();
			$.ajax({
				url : URL_SERVICE + "/list/oficceDetail/" + code,
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data, idLabel, idSelect);
				},
				error : function(xhr, status, error) {
					$('#sp_wait').hide();
					processData(status, error);
				}
			});

			return true;

		},

		getListCountries : function(processData) {
			$('#sp_wait').show();
			service = this;
			$.ajax({
				url : URL_SERVICE + "/list/paises",
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data);

				},
				error : function(xhr, status, error) {
					$('#sp_wait').hide();
					processData(status, error);
				}
			});

		},

		getListDeparments : function(idPais, processData, idCombo) {
			service = this;
			if (idPais == "" || idPais == "undefined") {
				return false;
			}
			$('#sp_wait').show();
			$.ajax({
				url : URL_SERVICE + "/list/departamentos/" + idPais,
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data, idCombo);
				},
				error : function(xhr, status, error) {
					$('#error-form-db').modal();
					$('#sp_wait').hide();
					processData(status, error);
				}
			});

			return true;

		},

		getListCities : function(idDepartamento, processData, idCombo) {
			service = this;
			if (idDepartamento == "" || idDepartamento == "undefined") {
				return false;
			}
			$('#sp_wait').show();
			$.ajax({
				url : URL_SERVICE + "/list/ciudades/" + idDepartamento,
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data, idCombo);
				},
				error : function(xhr, status, error) {
					$('#error-form-db').modal();
					$('#sp_wait').hide();
					processData(status, error);
				}
			});

			return true;

		},

		getListZoneOffices : function(idDepartamento, idCity, processData,
				idCombo) {
			service = this;
			if (idDepartamento == "" || idDepartamento == "undefined") {
				return false;
			}
			$('#sp_wait').show();
			$.ajax({
				url : URL_SERVICE + "/list/localidades/",
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data, idCombo);
				},
				error : function(xhr, status, error) {
					$('#error-form-db').modal();
					$('#sp_wait').hide();
					processData(status, error, idCombo);
				}
			});

			return true;

		},

		getListOffices : function(idDepartamento, idCity, idLoca, processData,
				idCombo) {
			service = this;
			if (idDepartamento == "" || idDepartamento == "undefined") {
				return false;
			}
			$('#sp_wait').show();
			$.ajax({
				url : URL_SERVICE + "/list/oficinas/" + idDepartamento + "/"
						+ idCity + "/" + idLoca,
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data, idCombo);
				},
				error : function(xhr, status, error) {
					$('#error-form-db').modal();
					$('#sp_wait').hide();
					processData(status, error);
				}
			});

			return true;

		},

		getListEconomicActivity : function(processData) {
			service = this;
			$('#sp_wait').show();

			$.ajax({
				url : URL_SERVICE + "/list/ciiu/divisiones",
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data);
				},
				error : function(xhr, status, error) {
					$('#error-form-db').modal();
					$('#sp_wait').hide();
					processData(status, error);
				}
			});

			return true;

		},

		getListSubEconomicActivity : function(idActivity, processData) {
			service = this;
			if (idActivity == "" || idActivity == "undefined") {
				return false;
			}
			$('#sp_wait').show();
			$.ajax({
				url : URL_SERVICE + "/list/ciiu/grupos/" + idActivity,
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data);
				},
				error : function(xhr, status, error) {
					$('#error-form-db').modal();
					$('#sp_wait').hide();
					processData(status, error);
				}
			});

			return true;

		},

		getListJobEconomicActivity : function(idSubActvity, processData) {
			service = this;
			if (idSubActvity == "" || idSubActvity == "undefined") {
				return false;
			}
			$('#sp_wait').show();
			$.ajax({
				url : URL_SERVICE + "/list/ciiu/ocupaciones/" + idSubActvity,
				type : 'GET',
				success : function(data) {
					$('#sp_wait').hide();
					processData("success", data);
				},
				error : function(xhr, status, error) {
					$('#error-form-db').modal();
					$('#sp_wait').hide();
					processData(status, error);
				}
			});

			return true;

		},

		addForm : function(step, form, keyCatcha) {
			service = this;
			var responseVal = $("#jcaptcha").val();//$("#g-recaptcha-response").val();
			$('#sp_wait').show();
			$.ajax({
				url : URL_SERVICE + "/gestion?responseClient=" + responseVal,
				type : 'POST',
				data : form,
				contentType : "application/json; charset=utf-8",
				success : function(data) {
					$('#sp_wait').hide();
					service.getDataForm(step, "success", data);
				},
				error : function(xhr, status, error) {
					// return;
					console.log(status);
					$('#sp_wait').hide();

					service.getDataForm(step, error, $
							.parseJSON(xhr.responseText));
				}
			});
		},

		getDataForm : function(step, action, data) {
			// {"errors":[{"fieldName":"Fecha
			// Registro","errorType":"MAX_RECORDS_ID"}]}
			switch (action) {
			case "Bad Request":
				for ( var i = 0; i < data.errors.length; i++) {
					if (data.errors[i].errorType == "MAX_RECORDS_ID") {
						$('#error-form-id').modal();
					} else

					if (data.errors[i].errorType == "MAX_RECORDS_IP") {

					} else {
						$('#error-form').modal();
					}
				}

				break;
			case "Not Found":
				break;
			case "success":
				if (data == "0") {
					// efecto correr bloquear el boton del step1 y habilitar el
					// next

					if (step == "step1") {
						$('html,body').animate({
							scrollTop : $("#step_two").offset().top
						}, 'slow');

						$("#step_two").find('.blocked_disabled').css("z-index",
								"-1");
						$("#step_one").find('.blocked_disabled').css("z-index",
								"1");
						com.bbva.events.Events.disabled_button("next_two");
						com.bbva.events.Events.turnOn_step("step_two");
					}

					if (step == "step2") {
						$('html,body').animate({
							scrollTop : $("#step_three").offset().top
						}, 'slow');
						$("#step_three").find('.blocked_disabled').css(
								"z-index", "-1");
						$("#step_two").find('.blocked_disabled').css("z-index",
								"1");
						com.bbva.events.Events.disabled_button("next_three");
						com.bbva.events.Events.turnOn_step("step_three");

					}

					if (step == "step3") {
						$('html,body').animate({
							scrollTop : $("#step_four").offset().top
						}, 'slow');

						$("#step_four").find('.blocked_disabled').css(
								"z-index", "-1");
						$("#step_three").find('.blocked_disabled').css(
								"z-index", "1");
						com.bbva.events.Events.disabled_button("next_four");
						com.bbva.events.Events.turnOn_step("step_four");

					}
					if (step == "step4") {
						$('html,body').animate({
							scrollTop : $("#step_five").offset().top
						}, 'slow');

						$("#step_five").find('.blocked_disabled').css(
								"z-index", "-1");
						$("#step_four").find('.blocked_disabled').css(
								"z-index", "1");
						com.bbva.events.Events.disabled_button("next_five");
						com.bbva.events.Events.turnOn_step("step_five");
					}
					if (step == "step5") {
						$('html,body').animate({
							scrollTop : $("#step_six").offset().top
						}, 'slow');
						$("#step_six").find('.blocked_disabled').css("z-index",
								"-1");
						$("#step_five").find('.blocked_disabled').css(
								"z-index", "1");
						com.bbva.events.Events.disabled_button("next_six");
						com.bbva.events.Events.turnOn_step("step_six");
					}
					if (step == "step6") {
						$('html,body').animate({
							scrollTop : $("#step_seven").offset().top
						}, 'slow');

						$("#step_seven").find('.blocked_disabled').css(
								"z-index", "-1");
						$("#step_six").find('.blocked_disabled').css("z-index",
								"1");
						com.bbva.events.Events.disabled_button("next_seven");
						com.bbva.events.Events.turnOn_step("step_seven");
					}
					if (step == "step7") {
						if (com.bbva.events.Events.offices != null) {
							var obj = ((com.bbva.config.Config.JSONFORM.step2.status == 0) ? com.bbva.events.Events.office1
									: com.bbva.events.Events.office2);
							if (obj != 'undefined') {
								$("#nom").text(
										$("#lb_name1").val() + " "
												+ $("#lb_last_name1").val());
								$("#nomOfi").text(obj.nombreOficina);
								$("#dirOfi").text(obj.direccion);
								$("#telOfi").text(obj.telefonos);
								if (obj.horarioLV != "") {
									$("#horOfi").text(obj.horarioLV);
								} else {
									$("#horarioNormal").empty();
									$("#horarioNormalIco").empty();
								}
								if (obj.horaioALV != "") {
									$("#horaOfi").text(obj.horaioALV);
								} else {
									$("#horarioExtendido").empty();
								}
								if (obj.horarioS != "") {
									$("#horsOfi").text(obj.horarioS);
								} else {
									$("#horarioSabado").empty();
								}
							}

						} else {
							$("#nom").text(
									$("#lb_name1").val() + " "
											+ $("#lb_last_name1").val());
							var office = ((com.bbva.config.Config.JSONFORM.step2.status == 0) ? $(
									'#lb_ges_ofi').val()
									: $('#lb_ges_ofi2').val());

							$("#nomOfi").text(office);
						}
						
						$('html,body').animate({
							scrollTop : $("#step_eleven").offset().top
						}, 'slow');

						$("#step_eleven").find('.blocked_disabled').css(
								"z-index", "-1");
						$("#step_seven").find('.blocked_disabled').css(
								"z-index", "1");
						com.bbva.events.Events.disabled_button("btn_end");
						_satellite.track("onlineAccountWeb_next_seven");

					}
				} else if (data == "-2") {
					$("#jcaptcha").val("");
					$("#jcaptchaimg").attr("src", "jcaptcha.jpg?"+Math.floor((Math.random() * 30) + 1));					
					$('#error-form-recaptcha').modal();
				}
				break;
			default:
				$('#error-form').modal();
				break;
			}
		},
		getDataOfficesByService : function(action, data, idLabel, selectId) {

			switch (action) {

			case "error":

				break;
			case "Not Found":

				break;
			case "success":
				var arrayOffice = [];
				var message;
				if (data != 'undefined' || data != null || data != '') {
					$("#" + idLabel).html(
							data.nombreOficina + " " + data.direccion + " "
									+ data.horarioLV);
					$("#" + idLabel).css("display", "block");
					if (selectId == "lb_ges_ofi") {
						com.bbva.events.Events.office1 = data;

					} else {
						if (selectId == "lb_ges_ofi2") {
							com.bbva.events.Events.office2 = data;
						}
					}

				} else {
					message = '';
					$("#" + idLabel).html('');
				}
			}
		},

		getDataOffices : function(action, data) {

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var arrayOffice = [];
				var list_country;
				if (data.length > 0) {
					list_country = '<option value="">Selecciona</option>';

					for ( var i = 0; i < data.length; i++) {
						list_country = list_country + '<option value="'
								+ data[i].codigoOficina + '">'
								+ data[i].nombreOficina + '</option>';
						arrayOffice.push(data[i]);
					}
					;
				} else {
					list_country = '<option value="">No hay oficinas disponibles</option>';
				}
				$("#lb_ges_ofi").html(list_country).selectmenu("refresh");
				com.bbva.events.Events.offices = arrayOffice;
				// $("#address_show1").html();

			}
		},

		getDataOfficesForHiddenZone : function(action, data, idCombo) {

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var arrayOffice = [];
				if (data.length > 0) {
					var list_country = '<option value="">Selecciona</option>';
					for ( var i = 0; i < data.length; i++) {
						list_country = list_country + '<option value="'
								+ data[i].codigoOficina + '">'
								+ data[i].nombreOficina + '</option>';
						arrayOffice.push(data[i]);
					}
					;
				} else {
					list_country = '<option value="">No hay oficinas disponibles</option>';
				}
				$("#" + idCombo).html(list_country).selectmenu("refresh");

				com.bbva.events.Events.offices = arrayOffice;

			}
		},

		getDataZoneOfficeXZone : function(action, data, idCombo) {

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var list_country = '<option value="">Selecciona</option>';
				for ( var i = 0; i < data.length; i++) {
					list_country = list_country + '<option value="'
							+ data[i].id + '">' + data[i].description
							+ '</option>';
				}
				;

				$("#" + idCombo).html(list_country).selectmenu("refresh");

			}
		},

		getDataZoneOffice : function(action, data, combo) {

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var list_country = '<option value="">Selecciona</option>';
				for ( var i = 0; i < data.length; i++) {
					list_country = list_country + '<option value="'
							+ data[i].id + '">' + data[i].description
							+ '</option>';
				}
				;

				$("#" + combo).html(list_country).selectmenu("refresh");

			}
		},

		getDataEconomicActivity : function(action, data) {
			console.log(data);

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var list_country = '<option value="">Selecciona</option>';
				for ( var i = 0; i < data.length; i++) {
					list_country = list_country + '<option value="'
							+ data[i].id + '">' + data[i].description
							+ '</option>';
				}
				;

				$("#lb_act_economic").html(list_country).selectmenu("refresh");

			}
		},

		getDataSubEconomicActivity : function(action, data) {

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var list_country = '<option value="">Selecciona</option>';
				for ( var i = 0; i < data.length; i++) {
					list_country = list_country + '<option value="'
							+ data[i].id + '">' + data[i].description
							+ '</option>';
				}
				;

				$("#lb_subact_economic").html(list_country).selectmenu(
						"refresh");
			}
		},

		getDataJobEconomicActivity : function(action, data) {
			console.log(data);

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var list_cities = '<option value="">Selecciona</option>';
				for ( var i = 0; i < data.length; i++) {
					list_cities = list_cities + '<option value="' + data[i].id
							+ '">' + data[i].description + '</option>';
				}
				;

				$("#lb_prof_act").html(list_cities).selectmenu("refresh");

			}
		},

		getDataCountry : function(action, data) {
			console.log(data);
			console.log(action);

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var list_country = '<option value="">Selecciona</option>';
				for ( var i = 0; i < data.length; i++) {
					list_country = list_country + '<option value="'
							+ data[i].id + '">' + data[i].description
							+ '</option>';
				}
				;
				$("#lb_bi_country").html(list_country).selectmenu("refresh");

				break;

			case "Internal Server Error":
				break;

			}
		},

		getDataDpto : function(action, data, idCombo) {

			switch (action) {
			case "error":
				$('#error-form-db').modal();
				break;
			case "Not Found":

				break;
			case "success":
				var list_dpto = '<option value="">Selecciona</option>';
				for ( var i = 0; i < data.length; i++) {
					list_dpto = list_dpto + '<option value="' + data[i].id
							+ '">' + data[i].description + '</option>';
				}
				;

				$("#" + idCombo).html(list_dpto).selectmenu("refresh");

			}
		},

		getDataCities : function(action, data, id) {
			console.log(data);

			switch (action) {
			case "Not Found":
				$('#error-form-db').modal();
				break;
			case "success":
				var list_cities = '<option value="">Selecciona</option>';
				for ( var i = 0; i < data.length; i++) {
					list_cities = list_cities + '<option value="' + data[i].id
							+ '">' + data[i].description + '</option>';
				}
				;

				$("#" + id).html(list_cities).selectmenu("refresh");

			}
		}

	}

})();
