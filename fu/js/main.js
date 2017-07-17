/*
Archivo principal del front se encarga de inicializar los demás archivos y lanzar los pricipales eventos de la aplicación,
como lo son los botones de cada step 
 */

var com = {};
com.bbva = com.bbva || {};
com.bbva.main = com.bbva.main || {};

com.bbva.main.Main = (function(wd, document) {

	/* Variables privadas */
	var status = 0, isInitialized = false, configCLass = null, eventsClass = null, validateClass = null, mainClass = null, isDownload = 0;

	return {
		/* Funciones públicas */
		setIsDownload : function(val) {
			isDownload = val;
		},

		getIsDownload : function() {
			return isDownload;
		},

		init : function() {
			/* Inicializa las demás clases de JS */
			configCLass = wd.com.bbva.config.Config;
			eventsClass = wd.com.bbva.events.Events.init().events();
			validateClass = wd.com.bbva.main.validate.Validate.init();
			serviceClass = wd.com.bbva.service.Service;
			mainClass = this;

			/* Llenar combos de ciudades dpto,pais, actividades economicas */

			com.bbva.service.Service.getListDeparments("1",
					com.bbva.service.Service.getDataDpto, "lb_res_dep");
			com.bbva.service.Service.getListDeparments("1",
					com.bbva.service.Service.getDataDpto, "lb_bir_dto");
			com.bbva.service.Service.getListDeparments("1",
					com.bbva.service.Service.getDataDpto, "lb_res_dep");
			com.bbva.service.Service.getListDeparments("1",
					com.bbva.service.Service.getDataDpto, "dpto_zone_office");

			
			com.bbva.service.Service.getListDeparments(1,
					com.bbva.service.Service.getDataDpto, "lb_id_exp_dto");

			
			
			/* Evento para Envíar datos del primer step */
			$("#next_one").unbind("click").click(
					function(e) {
						e.preventDefault();

						var is_error_step1 = validateClass
								.validate(configCLass.JSONFORM.step1);

						if (is_error_step1) {
							_satellite.track("onlineAccountWeb_next_one");
							serviceClass.addForm("step1", JSON
									.stringify(mainClass.getJsonStep1()),
									"code_rapcatch");
						} else {
							validateClass.show_error();
						}

						return;
					});

			/* Evento para Envíar datos del segundo step */
			$("#next_two")
					.unbind("click")
					.click(
							function(e) {

								e.preventDefault();
								var json_validate = null;
								var opt = com.bbva.config.Config.JSONFORM.step2.status;
								if (opt == 0) {
									json_validate = configCLass.JSONFORM.step2.status_one;
								} else {
									json_validate = configCLass.JSONFORM.step2.status_two;
								}
								var is_error_step2 = validateClass
										.validate(json_validate);

								if (is_error_step2) {
									
									_satellite.track("onlineAccountWeb_next_two");
									
									serviceClass
											.addForm(
													"step2",
													JSON
															.stringify(mainClass
																	.getJsonStep2(json_validate)),
													"code_rapcatch");
								} else {
									validateClass.show_error();
								}
								return;
							});

			/* Evento para Envíar datos del tercer step */
			$("#next_three").unbind("click").click(
					function(e) {
						e.preventDefault();

						var is_error_step3 = validateClass
								.validate(configCLass.JSONFORM.step3);
						//$('#lb_phone')
						var num_phone = validateClass
						.validate_number_phone($('#lb_phone').val());
						
						if (is_error_step3 && num_phone) {
							_satellite.track("onlineAccountWeb_next_three");
							serviceClass.addForm("step3", JSON
									.stringify(mainClass.getJsonStep3()),
									"code_rapcatch");
							$('#lb_phone').attr("title", "");
							$('#lb_phone').removeClass("ui-selectmenu-error");
						} else {
							validateClass.show_error();
							if(!num_phone){
								$('#lb_phone').attr("title", "Si ingresas tel\u00e9fono debe tener minimo 7 digitos");
								$('#lb_phone').addClass("ui-selectmenu-error");
							}else{
								$('#lb_phone').attr("title", "");
								$('#lb_phone').removeClass("ui-selectmenu-error");
							}
							
						}

						return;
					});

			/* Evento para Envíar datos del cuarto step */
			$("#next_four").unbind("click").click(
					function(e) {
						e.preventDefault();

						var is_error_step1 = validateClass
								.validate(configCLass.JSONFORM.step4);

						if (is_error_step1) {
							_satellite.track("onlineAccountWeb_next_four");
							serviceClass.addForm("step4", JSON
									.stringify(mainClass.getJsonStep4()),
									"code_rapcatch");
						} else {
							validateClass.show_error();
						}

						return;
					});

			/* Evento para Envíar datos del quinto step */
			$("#next_five").unbind("click").click(
					function(e) {
						e.preventDefault();

						var is_error_step1 = validateClass
								.validate(configCLass.JSONFORM.step5);

						if (is_error_step1) {
							_satellite.track("onlineAccountWeb_next_five");
							serviceClass.addForm("step5", JSON
									.stringify(mainClass.getJsonStep5()),
									"code_rapcatch");
						} else {
							validateClass.show_error();
						}

						return;
					});

			/* Evento para Envíar datos del sexto step */
			$("#next_six").unbind("click").click(
					function(e) {
						e.preventDefault();

						var is_error_step1 = validateClass
								.validate(configCLass.JSONFORM.step6);

						if (is_error_step1) {
							$("#jcaptchaimg").attr("src", "jcaptcha.jpg?"+Math.floor((Math.random() * 30) + 1));
							_satellite.track("onlineAccountWeb_next_six");
							serviceClass.addForm("step6", JSON
									.stringify(mainClass.getJsonStep6()),
									"code_rapcatch");
						} else {
							validateClass.show_error();
						}

						return;
					});

			/* Evento para Envíar datos del septimo step */
			$("#next_seven").unbind("click").click(
					function(e) {
						e.preventDefault();

						var is_error_step1 = validateClass
								.validate_term_condidtions();

						if (is_error_step1) {
							serviceClass.addForm("step7", JSON
									.stringify(mainClass.getJsonStep7()),
									"code_rapcatch");
							validateClass.show_error2();
						} else {
							validateClass.show_error2();
						}

						return;
					});

		},

		hideForClass : function(className) {
			$(className).hide();
		},

		showForClass : function(className) {
			$(className).show();
		},

		createStructure : function(obj, countStep) {

			for ( var propertyName in obj) {
				obj[propertyName] = this.setDataField(obj[propertyName]);

			}

			return obj;
		},

		setDataField : function(obj) {
			for ( var propertyName in obj) {
				obj[propertyName].field = obj[propertyName].field.val();
			}
			return obj;
		},

		/*
		 * Función que devuelve los datos para enviar los datos del segundo
		 * step
		 */
		getJsonStep2 : function() {

			return {
				"download_ofert" : isDownload,
				"download_term" : 0,
				"lb_id" : $('#lb_id').val(),
				"lb_res_dep" : $('#lb_res_dep').val(),
				"lb_res_cit" : $('#lb_res_cit').val(),
				"lb_add_tipvia" : $('#lb_add_tipvia').val(),
				"lb_add_num" : $('#lb_add_num').val(),
				"lb_add_bis" : ($("#lb_add_bis").is(':checked') ? "b" : ""),
				"lb_add_car" : $('#lb_add_car').val(),
				"lb_add_numpla1" : $('#lb_add_numpla1').val(),
				"lb_add_bis2" : ($("#lb_add_bis2").is(':checked') ? "b" : ""),
				"lb_add_car2" : $('#lb_add_car2').val(),
				"lb_add_numpla2" : $('#lb_add_numpla2').val(),
				"lb_ges_zon" : ((com.bbva.config.Config.JSONFORM.step2.status == 0) ? $(
						'#lb_ges_zon').val()
						: $('#lb_ges_zon2').val()),// $('#lb_ges_zon').val(),
				"lb_desc" : $('#lb_desc').val(),
				"lb_ges_ofi" : ((com.bbva.config.Config.JSONFORM.step2.status == 0) ? $(
						'#lb_ges_ofi').val()
						: $('#lb_ges_ofi2').val()),// $('#lb_ges_ofi').val(),
				"lb_ip" : "190.0.0.1",
				"step" : 2
			}
		},

		/* Función que devuelve los datos para enviar los datos del primer step */
		getJsonStep1 : function() {
			return {
				"download_ofert" : isDownload,
				"download_term" : 0,
				"lb_id" : $('#lb_id').val(),
				"lb_civ_sta" : $('#lb_civ_sta').val(),
				"lb_last_name1" : $('#lb_last_name1').val(),
				"lb_last_name2" : "",
				"lb_name1" : $('#lb_name1').val(),
				"lb_name2" : "",
				"lb_sex" : $('input:radio[name=lb_sex]:checked').val(),
				"lb_typeid" : $('#lb_typeid').val(),
				"lb_id_exp_dto" : $('#lb_id_exp_dto').val(),
				"lb_id_exp_city" : $('#lb_id_exp_city').val(),
				"lb_id_date" : $('#lb_id_year').val() + $('#lb_id_month').val()
						+ $('#lb_id_day').val(),
				"lb_bir_city" : $('#lb_bir_city').val(),
				"lb_bir_dto" : $('#lb_bir_dto').val(),
				"lb_bir_date" : $('#lb_bir_year').val()
						+ $('#lb_bir_month').val() + $('#lb_bir_day').val(),
				"lb_ip" : "190.0.0.1",
				"step" : 1
			};
		},

		/* Función que devuelve los datos para enviar los datos del tercer step */
		getJsonStep3 : function() {
			return {
				"download_ofert" : isDownload,
				"download_term" : 0,
				"lb_id" : $('#lb_id').val(),
				"lb_email" : $('#lb_email').val(),
				"lb_phone" : $('#lb_phone').val(),
				"lb_celphone" : $('#lb_celphone').val(),
				"lb_ext" : $('#lb_ext').val(),
				"step" : 3
			};
		},

		/* Función que devuelve los datos para enviar los datos del cuarto step */
		getJsonStep4 : function() {
			return {
				"download_ofert" : isDownload,
				"download_term" : 0,
				"lb_id" : $('#lb_id').val(),
				"lb_situacion_laboral" : $('#lb_situacion_laboral').val(),
				"lb_comp" : $('#lb_comp').val(),
				"lb_comp_nit" : $('#lb_comp_nit').val(),
				"lb_comp_dg" : $('#lb_comp_dg').val(),
				"lb_cargo" : $('#lb_cargo').val(),
				"lb_cod_pro" : 608,
				"step" : 4
			};
		},

		/* Función que devuelve los datos para enviar los datos del quinto step */
		getJsonStep5 : function() {
			return {
				"download_ofert" : isDownload,
				"download_term" : 0,
				"lb_id" : $('#lb_id').val(),
				"lb_ing_mon" : limpiarMoneda($('#lb_ing_mon').val()),
				"lb_ing_ote" : limpiarMoneda($('#lb_ing_ote').val()),

				"step" : 5
			};
		},

		/* Función que devuelve los datos para enviar los datos del sexto step */
		getJsonStep6 : function() {
			return {
				"download_ofert" : isDownload,
				"download_term" : 0,
				"lb_id" : $('#lb_id').val(),
				"lb_exo_acc" : ($('#lb_exo_acc').is(':checked') ? "A" : "N"),
				"lb_type_acc" : $('#lb_type_acc').val(),
				"step" : 6
			};
		},

		/*
		 * Función que devuelve los datos para enviar los datos del septimo
		 * step
		 */
		getJsonStep7 : function() {
			return {
				"download_ofert" : isDownload,
				"download_term" : 0,
				"lb_id" : $('#lb_id').val(),
				"checkbox1" : ($('#checkbox1').is(':checked') ? "1" : "0"),
				"checkbox2" : ($('#checkbox2').is(':checked') ? "1" : "0"),

				"step" : 7
			};
		},

		/*
		 * Función que devuelve los datos para enviar los datos de todo (NO SE
		 * USA)
		 */
		getJson : function() {

			return {

				lb_name1 : $('#lb_name1').val(),
				lb_name2 : $('#lb_name2').val(),
				lb_last_name1 : $('#lb_last_name1').val(),
				lb_last_name2 : $('#lb_last_name2').val(),
				lb_sex : $('#lb_sex').val(),
				lb_typeid : $('#lb_typeid').val(),
				lb_id : $('#lb_id').val(),
				lb_bir_city : $('#lb_bir_city').val(),
				lb_bir_dto : $('#lb_bir_dto').val(),
				lb_bir_date : $('#lb_bir_year').val()
						+ $('#lb_bir_month').val() + $('#lb_bir_day').val(),
				lb_id_exp_city : $('#lb_id_exp_city').val(),
				lb_id_exp_dto : $('#lb_id_exp_dto').val(),
				lb_id_date : $('#lb_id_year').val() + $('#lb_id_month').val()
						+ $('#lb_id_day').val(),
				lb_civ_sta : $('#lb_civ_sta').val(),
				lb_address : $('#lb_address').val(),
				lb_res_cit : $('#lb_res_cit').val(),
				lb_ges_ofi : $('#lb_ges_ofi').val(),
				lb_res_dep : $('#lb_res_dep').val(),
				lb_phone : $('#lb_phone').val(),
				lb_email : $('#lb_email').val(),
				lb_comp_nit : $('#lb_comp_nit').val(),
				lb_comp_dg : $('#lb_comp_dg').val(),
				lb_comp : $('#lb_comp').val(),
				lb_exo_acc : $('#lb_exo_acc').val(),
				lb_type_acc : $('#lb_type_acc').val(),
				lb_ing_mon : $('#lb_ing_mon').val(),
				checkbox1 : (($('#checkbox1').val() === "on") ? "1" : "0"),
				checkbox2 : (($('#checkbox2').val() === "on") ? "1" : "0"),
				lb_bi_country : $('#lb_bi_country').val(),
				lb_ges_zon : $('#lb_ges_zon').val(),
				lb_cod_pro : $('#lb_prof_act').val(),
				lb_add_bis : $('#lb_add_bis').val(),
				lb_add_car : $('#lb_add_car').val(),
				lb_add_numpla1 : $('#lb_add_numpla1').val(),
				lb_add_ord2 : $('#lb_add_ord2').val(),
				lb_add_bis2 : $('#lb_add_bis2').val(),
				lb_add_car2 : $('#lb_add_car2').val(),
				lb_add_numpla2 : $('#lb_add_numpla2').val(),
				lb_add_tipvia : $('#lb_add_tipvia').val(),
				lb_add_num : $('#lb_add_num').val(),
				lb_add_ord : $('#lb_add_ord').val(),
				lb_situacion_laboral : $(
						'input[name="lb_situacion_laboral"]:checked').val(),
				download : isDownload

			}
		}

	}

	/* Función que limpía los valores de moneda (peso) */
	function limpiarMoneda(cadena) {
		cadena = cadena.replace(/\,/g, '');
		cadena = cadena.replace(/\./g, '');
		cadena = cadena.replace(/\$/g, '');
		return cadena;
	}

})(window, document);
