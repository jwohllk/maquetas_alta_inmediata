com.bbva.events = com.bbva.events || {};

com.bbva.events.Events = com.bbva.events.Events = (function(jQ, wd, document) {

	var status = 0, isInitialized = false, element = null, eventClass = null, office1 = null, office2 = null, offices = null;

	return {

		init : function() {
			status = 1;
			isInitialized = true;
			if (eventClass == null || eventClass == "undefined") {
				eventClass = wd.com.bbva.events.Events;
			}
			return this;
		},

		disabled_button2 : function(idButton) {
			$("#" + idButton).addClass("button_disable");
			$('#' + idButton).prop("disabled", true);
		},

		disabled_button : function(idButton) {
			$("#" + idButton).removeClass("button_disable");
			$('#' + idButton).removeAttr('disabled');

		},

		turnOn_step : function(id) {
			// $('#check_step_one').removeClass('circle_unsuccess');
			// $('#check_step_one').addClass('circle_success');
			$('#check_' + id).removeClass('circle_unsuccess');
			$('#check_' + id).addClass('circle_success');
		},

		addescriptionStreet : function() {
			for ( var i = 0; i < wd.com.bbva.events.Events.offices.length; ++i) {
				if (wd.com.bbva.events.Events.offices[i].codigoOficina == $(
						"#lb_ges_ofi").val()) {
					$("#address_show1")
							.html(
									wd.com.bbva.events.Events.offices[i].nombreOficina
											+ " "
											+ wd.com.bbva.events.Events.offices[i].direccion
											+ " "
											+ wd.com.bbva.events.Events.offices[i].horarioLV);
					$("#address_show1").css("display", "block");
				}
			}
		},
		addescriptionStreetByID : function(code, office, show) {
			com.bbva.service.Service.getDetailsByOffice(office, show, code,
					com.bbva.service.Service.getDataOfficesByService);

		},
		getAddescription : function(office) {
			var data = null;
			for ( var i = 0; i < wd.com.bbva.events.Events.offices.length; ++i) {
				if (wd.com.bbva.events.Events.offices[i].codigoOficina == office) {
					data = wd.com.bbva.events.Events.offices[i];
					break;

				}
			}
			return data;
		},
		disableContentForStep : function(id_div) {
			/*
			 * $("#" + id_div).find('input, textarea, button,
			 * select').attr('disabled', 'disabled'); $("#" +
			 * id_div).find('input, textarea, button, select').prop("disabled",
			 * true); $("#" + id_div).load();
			 */
		},
		pad : function(n, length) {
			var n = n.toString();
			while (n.length < length)
				n = "0" + n;
			return n;

		},
		events : function() {
			$('#lb_add_num').mask('0AAS');
			$('#lb_add_numpla1').mask('0AAS');

			$('#captcha-reload').on('click', function(e) {
				$("#jcaptchaimg").attr("src", "jcaptcha.jpg?"+Math.floor((Math.random() * 30) + 1));
			});


			$(".ui-corner-all").css("width", "100%");

			$('#lb_ing_mon').priceFormat({
				prefix : '$',
				centsLimit : 0
			});

			$('#lb_ing_ote').priceFormat({
				prefix : '$',
				centsLimit : 0
			});
			$('#init_now').on('click', function(e) {

				$('html,body').animate({
					scrollTop : $("#step_one").offset().top
				}, 'slow');
				com.bbva.events.Events.disabled_button("next_one");

			});
			/* Eventos fechas */

			$("#lb_id_day").blur(
					function() {
						if ($("#lb_id_day").val() < 10
								&& $("#lb_id_day").val() > 0)
							$("#lb_id_day").val(
									com.bbva.events.Events.pad($("#lb_id_day")
											.val(), 2));
					});
			$("#lb_id_month").blur(
					function() {
						if ($("#lb_id_month").val() < 10
								&& $("#lb_id_month").val() > 0)
							$("#lb_id_month").val(
									com.bbva.events.Events.pad(
											$("#lb_id_month").val(), 2));
					});
			$("#lb_bir_day").blur(
					function() {
						if ($("#lb_bir_day").val() < 10
								&& $("#lb_bir_day").val() > 0)
							$("#lb_bir_day").val(
									com.bbva.events.Events.pad($("#lb_bir_day")
											.val(), 2));
					});
			$("#lb_bir_month").blur(
					function() {
						if ($("#lb_bir_month").val() < 10
								&& $("#lb_bir_month").val() > 0)
							$("#lb_bir_month").val(
									com.bbva.events.Events.pad($(
											"#lb_bir_month").val(), 2));
					});
			/* ------------------------------------------------------------- */
			$('#office_management')
					.on(
							'click',
							function(e) { //
								if ($("#office_management").is(":checked")) {
									$("#address_show1").html("");
									$('#lb_ges_zon').prop('disabled',
											'disabled').selectmenu("refresh");
									$('#lb_ges_ofi').prop('disabled',
											'disabled').selectmenu("refresh");
									$("#address_show1").css("display", "none");
									$("#block_hidden").css("display", "block");
									$("#dpto_zone_office-button").css("width",
											"100%");
									$("#city_zone_office-button").css("width",
											"100%");
									$("#lb_ges_zon2-button").css("width",
											"100%");
									$("#lb_ges_ofi2-button").css("width",
											"100%");
									$(".title_block").css("display", "block");
									document.getElementById('lb_ges_ofi')
											.getElementsByTagName('option')[0].selected = 'selected';
									$("#lb_ges_ofi").selectmenu("refresh");


									$("#lb_ges_ofi-button").removeClass(
											"ui-selectmenu-error");
									$("#lb_ges_ofi-button").attr("title", "");

									com.bbva.config.Config.JSONFORM.step2.status = 1;
									document.getElementById('lb_ges_zon')
											.getElementsByTagName('option')[0].selected = 'selected';
									$("#lb_ges_zon").selectmenu("refresh");
									// dpto_zone_office-button
								} else {
									$('#lb_ges_zon').removeAttr('disabled')
											.selectmenu("refresh");
									$('#lb_ges_ofi').removeAttr('disabled')
											.selectmenu("refresh");

									$("#block_hidden").css("display", "none");
									$("#address_show1").css("display", "block");
									$(".title_block").css("display", "none");
									com.bbva.config.Config.JSONFORM.step2.status = 0;

								}

							});

			$("#next_zero").unbind("click").click(function(e) {

				_satellite.track("onlineAccountWeb_next_zero");

				$("iframe").attr("title", "");
				$('html,body').animate({
					scrollTop : $("#step_one").offset().top
				}, 'slow');
				$("#lb_add_tipvia-button").css("width","75px");
				$("#step_one").find('.blocked_disabled').css("z-index", "-1");
				com.bbva.events.Events.disabled_button("next_one");
				com.bbva.events.Events.disabled_button2("next_zero");
				com.bbva.events.Events.turnOn_step('step_one');
			});

			$("#ofert_").unbind("click").click(function(e) {
				e.preventDefault();
				// console.log("asdsd");
				$('#login-form').modal();
				return;
			});
			$('#checkbox1').on('click', function(e) { // lb_accept
				if ($('#checkbox1').is(':checked') === true) {
					$('#myModal').foundation('reveal', 'open');
				}
			});

			$('#lb_accept').on('click', function(e) { //
				$('#myModal').foundation('reveal', 'close');

			});

			$('#download_offer').on('click', function(e) {
				e.preventDefault();
				window.open("./file/oferta_valor.pdf", 'Download');
				com.bbva.main.Main.setIsDownload(1);
			});

			/* Eventos para llenar los combos en cadena */
			$("#lb_bi_country").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.service.Service.getListDeparments(
									this.value,
									com.bbva.service.Service.getDataDpto,
									"lb_res_dep");
							com.bbva.service.Service.getListDeparments(
									this.value,
									com.bbva.service.Service.getDataDpto,
									"lb_bir_dto");
						}
					});

			$("#lb_act_economic")
					.selectmenu(
							{
								change : function(event, ui) {
									com.bbva.service.Service
											.getListSubEconomicActivity(
													this.value,
													com.bbva.service.Service.getDataSubEconomicActivity);
								}
							});

			$("#lb_subact_economic")
					.selectmenu(
							{
								change : function(event, ui) {
									com.bbva.service.Service
											.getListJobEconomicActivity(
													this.value,
													com.bbva.service.Service.getDataJobEconomicActivity);
								}
							});

			$("#lb_prof_act").selectmenu({
				change : function(event, ui) {

				}
			});

			$("#lb_id_exp_dto").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.service.Service.getListCities(this.value,
									com.bbva.service.Service.getDataCities,
									"lb_id_exp_city");
						}
					});

			$("#lb_res_dep").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.service.Service.getListCities(this.value,
									com.bbva.service.Service.getDataCities,
									"lb_res_cit");
						}
					});

			$("#lb_bir_dto").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.service.Service.getListCities(this.value,
									com.bbva.service.Service.getDataCities,
									"lb_bir_city");
						}

					});

			$("#lb_res_dep").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.service.Service.getListCities(this.value,
									com.bbva.service.Service.getDataCities,
									"lb_res_cit");
						}

					});
			$("#dpto_zone_office").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.service.Service.getListCities(this.value,
									com.bbva.service.Service.getDataCities,
									"city_zone_office");
						}

					});
			$("#dpto_zone_office").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.service.Service.getListCities(this.value,
									com.bbva.service.Service.getDataCities,
									"city_zone_office");
						}

					});
			/*
			 * $("#city_zone_office").selectmenu({ change: function(event, ui) {
			 * com.bbva.service.Service.getListZoneOffices($("#dpto_zone_office").val(),
			 * this.value, com.bbva.service.Service.getDataZoneOfficeXZone,
			 * "lb_ges_zon2"); //lb_ges_zon }
			 *
			 * });
			 */
			$("#city_zone_office")
					.selectmenu(
							{
								change : function(event, ui) {
									com.bbva.service.Service
											.getListZoneOffices(
													$("#dpto_zone_office")
															.val(),
													this.value,
													com.bbva.service.Service.getDataZoneOffice,
													"lb_ges_zon2");
									if ($('#city_zone_office option:selected')
											.html() != "BOGOTÁ D.C.") {
										$('#row_lb_ges_zon2').css("display",
												"none");
										$('#row_lb_ges_ofi2').css("float",
												"left");

										// llenar solo oficinas
										com.bbva.service.Service
												.getListOffices(
														$("#dpto_zone_office")
																.val(),
														$("#city_zone_office")
																.val(),
														"0",
														com.bbva.service.Service.getDataOfficesForHiddenZone,
														"lb_ges_ofi2");

									} else {
										$('#row_lb_ges_ofi2').css("float",
												"right");
										$('#row_lb_ges_zon2').css("display",
												"block");
									}
									$("#address_show2").css("display", "block");
									$("#address_show2").html("");
								}

							});

			$("#lb_res_cit")
					.selectmenu(
							{
								change : function(event, ui) {
									com.bbva.service.Service
											.getListZoneOffices(
													$("#lb_res_dep").val(),
													this.value,
													com.bbva.service.Service.getDataZoneOffice,
													"lb_ges_zon"); // lb_ges_zon

									if ($('#lb_res_cit option:selected').html() != "BOGOTÁ D.C.") {
										$('#row_lb_ges_zon').css("display",
												"none");
										$('#row_lb_ges_ofi').css("float",
												"left");

										// llenar solo oficinas
										com.bbva.service.Service
												.getListOffices(
														$("#lb_res_dep").val(),
														$("#lb_res_cit").val(),
														"0",
														com.bbva.service.Service.getDataOfficesForHiddenZone,
														"lb_ges_ofi");
									} else {
										$('#row_lb_ges_ofi').css("float",
												"right");
										$('#row_lb_ges_zon').css("display",
												"block");

									}

									$("#address_show1").css("display", "block");
									$("#address_show1").html("");
								}

							});

			$("#lb_ges_zon").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.service.Service.getListOffices($(
									"#lb_res_dep").val(), $("#lb_res_cit")
									.val(), this.value,
									com.bbva.service.Service.getDataOffices,
									"lb_ges_ofi");
						}

					});

			$("#lb_ges_zon2")
					.selectmenu(
							{
								change : function(event, ui) {
									com.bbva.service.Service
											.getListOffices(
													$("#dpto_zone_office")
															.val(),
													$("#city_zone_office")
															.val(),
													this.value,
													com.bbva.service.Service.getDataOfficesForHiddenZone,
													"lb_ges_ofi2");
								}

							});
			$("#lb_ges_ofi").selectmenu(
					{
						change : function(event, ui) {
							com.bbva.events.Events.addescriptionStreetByID(
									this.value, "lb_ges_ofi", "address_show1");

						}

					});

			$("#lb_ges_ofi2")
					.selectmenu(
							{
								change : function(event, ui) {
									com.bbva.events.Events
											.addescriptionStreetByID(
													this.value, "lb_ges_ofi2",
													"address_show2");

								}

							});
			$('input[name="lb_situacion_laboral"]').change(
					function(e) { // Select the radio input group

						if ($(this).val() == "EMPLEADO") {
							$(".block_").css("display", "block");
							if ($("#lb_comp_nit").val() == "0"
									|| $("#lb_comp_dg").val() == "0"
									|| $("#lb_comp").val() == "NA") {
								$("#lb_comp_nit").val("");
								$("#lb_comp_dg").val("");
								$("#lb_comp").val("");

							}

						}

						if ($(this).val() == "INDEPENDIENTE") {
							$(".block_").css("display", "none");
							$("#lb_comp_nit").val("0");
							$("#lb_comp_dg").val("0");
							$("#lb_comp").val("0");

						}

					});

			$("#lb_comp").keypress(function(event) { // valida
				// automaticamente
				// el
				console.log(event.which);
				var expreg = new RegExp("^[a-zA-Z0123456789_ ]*$");
				if (expreg.test(event.key)) {

				} else {

					return false;
				}
				// valida solo letras
			});

			$("#lb_cargo").keypress(function(event) { // valida
				// automaticamente
				// el
				console.log(event.which);
				var expreg = new RegExp("^[a-zA-Z0123456789_ ]*$");
				if (expreg.test(event.key)) {

				} else {

					return false;
				}
				// valida solo letras
			});

			$("#lb_name2").on(
					"keydown",
					function(event) { // valida solo letras
						console.log(event.which);
						var arr = [ 8, 9, 16, 17, 20, 35, 36, 37, 32, 38, 39,
								40, 45, 46 ];
						for ( var i = 65; i <= 90; i++) {
							arr.push(i);
						}
						if (jQuery.inArray(event.which, arr) === -1) {
							event.preventDefault();
						}
						var longeur = jQ('#lb_name2').val().length;
						if (longeur < 20) {
						} else {
							return false;
						}
					});

			$("#lb_last_name1").on(
					"keydown",
					function(event) { // valida solo letras
						console.log(event.which);
						var arr = [ 8, 9, 16, 17, 20, 35, 36, 37, 32, 38, 39,
								40, 45, 46, 192 ];
						for ( var i = 65; i <= 90; i++) {
							arr.push(i);
						}
						if (jQuery.inArray(event.which, arr) === -1) {
							event.preventDefault();
						}
						var longeur = jQ('#lb_last_name1').val().length;
						if (longeur < 20) {
						} else {
							return false;
						}
					});

			$("#lb_name2").on(
					"keydown",
					function(event) { // valida solo letras
						console.log(event.which);
						var arr = [ 8, 16, 17, 20, 35, 36, 37, 32, 38, 39, 40,
								45, 46 ];
						for ( var i = 65; i <= 90; i++) {
							arr.push(i);
						}
						if (jQuery.inArray(event.which, arr) === -1) {
							event.preventDefault();
						}
						var longeur = jQ('#lb_name2').val().length;
						if (longeur < 20) {
						} else {
							return false;
						}
					});

			jQ('#lb_comp_dg').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_comp_dg').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});
			jQ('#lb_id').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_id').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});
			jQ('#lb_celphone').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_celphone').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_comp_nit').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_comp_nit').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_ing_mon').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_ing_mon').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 11) {
						} else {
							return false;
						}
					});

			jQ('#lb_id_day').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_id_day').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_add_ord').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_add_ord').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_id_month').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_id_month').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_id_year').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_id_year').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#born_day').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#born_day').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#born_month').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#born_month').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#born_year').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#born_year').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_bir_day').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_bir_day').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_bir_month').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_bir_month').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_bir_year').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_bir_year').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_phone').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_phone').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			 jQ('#lb_email').keypress(function(event) { // valida
			 // automaticamente
			 // el email
			 console.log(event.which);
			 var expreg = new RegExp("^[a-zA-Z0-9@._\\-]$");
			 if (expreg.test(event.key)) {

			 } else {

			 return false;
			 }
			 // valida solo letras
			 });

			jQ('#lb_add_num').keypress(function(event) { // valida
				// automaticamente
				// el
				console.log(event.which);
				var expreg = new RegExp("^[a-zA-Z_0123456789\s]*$");
				if (expreg.test(event.key)) {

				} else {

					return false;
				}
				// valida solo letras
			});

			jQ('#lb_add_numpla1').keypress(function(event) { // valida
				// automaticamente
				// el
				console.log(event.which);
				var expreg = new RegExp("^[a-zA-Z_0123456789\s]*$");
				if (expreg.test(event.key)) {

				} else {

					return false;
				}
				// valida solo letras
			});

			jQ('#lb_add_numpla2').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_add_numpla2').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			jQ('#lb_comp2').keypress(
					function(event) { // valida automaticamente el input in
						// del campo para numeros
						var numero = String.fromCharCode(event.keyCode);
						var myArray = [ '0', '1', '2', '3', '4', '5', '6', '7',
								'8', '9', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
						index = myArray.indexOf(numero); // 1
						var longeur = jQ('#lb_comp').val().length;
						if (window.getSelection) {
							text = window.getSelection().toString();
						}
						if (index >= 0 & text.length > 0) {
						} else if (index >= 0 & longeur < 10) {
						} else {
							return false;
						}
					});

			var responsive_dots = function() {
				$('.fourth').css('left',
						$('.progress-line').width() - $('.fourth').width() + 1);
				$('.third').css(
						'left',
						($('.progress-line').width() / 2) - $('.third').width()
								+ 1);
			}
			$(window).resize(function() {
				responsive_dots();
			});
			responsive_dots();

			return this;
		},

		validateInputEmail : function(element) {
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return regex.test(element.value);
		},

		validateInputDate : function(element, formatDate) { // "YYYY-MM-DD"
			if (moment == "undefined" || element == "undefined") {
				return false
			}
			;
			return moment(element.value, [ formatDate ]).isValid();
		},

		validateInputText : function(element) {
			if (element == "undefined" || element.value == "") {
				return false;
			}
			return true;
		},

		isInputText : function(element) {
			if (element != "undefined") {
				return jQ(element).is('input:text');
			}
			return false;
		},

		validateInputTextModel : function(element) {
			if (this.isInputText(element) == true
					&& this.validateInputText(element) == true) {
				return {
					status : false,
					name : element.name,
					value : element.value,
					typeException : "empty"
				};
			}
			return {
				status : true,
				name : element.name,
				value : element.value,
				typeException : "empty"
			};
		},

		showValidateInputTex : function(element) {
			var objectResult = this.validateInputTextModel(element);
			if (objectResult.status == true) {
				jQ(".warning p").css("display", "block");
				jQ(".warning p").text("Error en el campo " + objectResult.name);
			}
		},

		validateInputNumeric : function(element) {
			if (element == "undefined" || element == null) {
				return false;
			}
			return jQ.isNumeric(element.value);
		},

		showValidateInputTexArray : function(form) {
			var arrayForm = document.getElementById(form).elements;
			for ( var i = 0; i < arrayForm.length; i++) {
				if (this.isInputText(arrayForm[i]) == true) {
					var objectResult = this
							.validateInputTextModel(arrayForm[i]);
					if (objectResult.status == true) {
						jQ(".warning p").css("display", "block");
						jQ(".warning p").text(
								"Error en el campo " + objectResult.name);
						break;
					}
				}
			}
		}
	}

})(jQuery, window, document);
