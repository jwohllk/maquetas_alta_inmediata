com.bbva.main.validate = com.bbva.main.validate || {};

com.bbva.main.validate.Validate = (function(wd, document) {

	var form = null;
	var error = "";

	return {

		getError : function() {
			return error;
		},

		init : function() {
			if (form == null || form == "undefined") {
				form = wd.com.bbva.main.validate.Validate; // this
			}
			return this;
		},

		getSize : function(value, length) {
			if (value === length) {
				return true;
			} else {
				return false;
			}
		},
		validate_term_condidtions : function() {
			// "checkbox1" :
			var ch1 = ($('#checkbox1').is(':checked') ? "1" : "0");
			var ch2 = ($('#checkbox2').is(':checked') ? "1" : "0");

			if (ch1 == "0" || ch2 == "0") {
				com.bbva.main.validate.Validate.error = "Debes aceptar t\u00e9rminos y condiciones";
				return false;
			} else {
				com.bbva.main.validate.Validate.error = "";
				return true;
			}

		},

		getLessThan : function(value, type) {
			if (type === "day") {
				var day = parseInt(value);
				if (day > 0 && day <= 31) {
					return true;
				} else {
					return false;
				}

			}
			if (type === "month") {
				var month = parseInt(value);
				if (month > 0 && month <= 12) {
					return true;
				} else {
					return false;
				}
			}
			if (type === "year") {
				var year = parseInt(value);
				if (year > 1900 && year <= 2016) {
					return true;
				} else {
					return false;
				}
			}
		},

		validate : function(obj) {
			var without_errors = true;
			form.error = "";
			var errores = 0;

			for ( var propertyName in obj) {

				var field = obj[propertyName];

				switch (field.type) {
				case 1:
					if (!form.validate_obligatory(field)) {
						if (field.field_foundation != undefined) {
							field.field_foundation.attr("title", field.msg);
							field.field_foundation
									.addClass("ui-selectmenu-error");
						} else {
							field.field.attr("title", field.msg);
							field.field.addClass("error-input");
							field.field.addClass("ui-selectmenu-error");
							$("#" + propertyName + "-button").addClass(
									"ui-selectmenu-error");
							$(".select_").selectmenu("refresh");
							$("#" + propertyName + "-button").attr("title",
									field.msg);
							errores = errores + 1;

							// lb_typeid-button

						}
						// form.error = field.msg;
						// return false;
					} else {
						if ((propertyName === "lb_id" || propertyName === "lb_ing_mon")
								&& field.field.val().length < field.min) {
							field.field.attr("title", field.msg);
							field.field.addClass("error-input");
							field.field.addClass("ui-selectmenu-error");
							$("#" + propertyName + "-button").addClass(
									"ui-selectmenu-error");
							$(".select_").selectmenu("refresh");
							$("#" + propertyName + "-button").attr("title",
									field.msg);
							errores = errores + 1;
						} else {
							if (field.field_foundation != undefined) {

								field.field_foundation.attr("title", "");
								field.field_foundation
										.removeClass("ui-selectmenu-error");
								$("#" + propertyName + "-button").removeClass(
										"ui-selectmenu-error");
								$("#" + propertyName + "-button").attr("title",
										"");
								errores = errores + 1;

							} else {
								field.field.attr("title", "");
								field.field.removeClass("error-input");
								$("#" + propertyName).removeClass(
										"ui-selectmenu-error");
								$("#" + propertyName + "-button").removeClass(
										"ui-selectmenu-error");
								$("#" + propertyName + "-button").attr("title",
										"");
							}
						}

					}
					break;
				case 2:
					if (form.error == '') {

						if (!this.getLessThan(field.field.val(), "day")) {
							field.field.attr("title", field.msg);
							field.field.addClass("error-input");
							form.error = field.msg;
							// return false;
						}
						{
							field.field.attr("title", "");
							field.field.removeClass("error-input");

						}
					} else {
						// return false;
					}
					break;
				case 3:
					if (!form.validate_obligatory(field)
							|| !form.validate_numeric(field)) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						field.field.addClass("ui-selectmenu-error");
						form.error = field.msg;
						errores = errores + 1;
					} else {
						if (propertyName === "lb_comp_nit"
								&& field.field.val().length < field.min) {
							field.field.attr("title", field.msg);
							field.field.addClass("error-input");
							field.field.addClass("ui-selectmenu-error");
							form.error = field.msg;
							errores = errores + 1;

						} else {
							field.field.removeClass("ui-selectmenu-error");
							field.field.removeClass("error-input");
							$("#" + propertyName + "-button").removeClass(
									"ui-selectmenu-error");
							$("#" + propertyName + "-button").attr("title", "");
						}
					}
					break;

				case 4:
					if (!form.validate_obligatory(field)
							|| !form.validate_EmailAddress(field)) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						field.field.addClass("ui-selectmenu-error");
						form.error = field.msg;
						errores = errores + 1;
						// return false;
					} else {
						field.field.attr("title", "");
						field.field.removeClass("error-input");
						field.field.removeClass("ui-selectmenu-error");
						$("#" + propertyName + "-button").removeClass(
								"ui-selectmenu-error");
						$("#" + propertyName + "-button").attr("title", "");

					}
					break;

				case 5:
					if (!form.validate_obligatory(field)
							|| !form.validate_numeric(field)
							|| field.field.val() > field.max) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						form.error = field.msg;
						// return false;
					} else {
						field.field.attr("title", "");
						field.field.removeClass("error-input");

					}
					break;

				case 6:

					// console.log(! field.field.val().lenght == field.max);
					if (!form.validate_obligatory(field)
							|| !form.validate_numeric(field)
							|| field.field.val().length != field.max) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						field.field.addClass("ui-selectmenu-error");
						form.error = field.msg;
						errores = errores + 1;
						// return false;
					} else {
						field.field.removeClass("ui-selectmenu-error");
						field.field.removeClass("error-input");
						$("#" + propertyName + "-button").removeClass(
								"ui-selectmenu-error");
						$("#" + propertyName + "-button").attr("title", "");
					}
					break;
				case 7:

					if (!form.validate_obligatory(field)
							|| !form.validate_diferent_of(field)) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						form.error = field.msg;
						// return false;
					} else {
						field.field.attr("title", "");
						field.field.removeClass("error-input");

					}
					break;
				case 8:
					if (!form.validate_obligatory(field)
							|| !form.validate_numeric(field)
							|| !form.validate_phone(field, 2)
							|| field.field.val().length != field.max) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						field.field.addClass("ui-selectmenu-error");
						form.error = field.msg;
						errores = errores + 1;
						// return false;
					} else {
						field.field.removeClass("ui-selectmenu-error");
						field.field.removeClass("error-input");
						form.error = "";
						$("#" + propertyName + "-button").removeClass(
								"ui-selectmenu-error");
						$("#" + propertyName + "-button").attr("title", "");

					}
					break;
				case 9:

					// console.log(! field.field.val().lenght == field.max);
					if (!form.validate_obligatory(field)
							|| !form.validate_greater_lower(field)) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						form.error = field.msg;
						// return false;
					} else {

						field.field.attr("title", "");
						field.field.removeClass("error-input");

					}
					break;
				case 10:

					if (!form.validate_issue_date(field.field.val())) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						form.error = field.msg;
						// return false;
					} else {
						field.field.attr("title", "");
						field.field.removeClass("error-input");

					}
					break;
				case 11:
					if (!form.validate_obligatory(field)
							|| !form.validate_numeric(field)
							|| field.field.val() > field.max
							|| field.field.val().length != field.maxlength) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						form.error = field.msg;
						// return false;
					} else {
						field.field.attr("title", "");
						field.field.removeClass("error-input");

					}
					break;
				case 12:
					if (!form.validate_obligatory(field)
							|| !form.validate_onlynumbersspaces(field)) {
						console.log("validando 12");
						if (field.field_foundation != undefined) {
							field.field_foundation.attr("title", field.msg);
							field.field_foundation
									.addClass("ui-selectmenu-error");

							// return false;
						} else {
							field.field.attr("title", field.msg);
							field.field.addClass("error-input");
							// return false;
						}
						errores = errores + 1;
						form.error = field.msg;
					} else {
						if (field.field_foundation != undefined) {
							field.field_foundation.attr("title", "")
							field.field_foundation
									.removeClass("ui-selectmenu-error");

						} else {
							field.field.attr("title", "");
							field.field.removeClass("error-input");

						}
					}
					break;
				case 13:

					if (!form.validate_obligatory(field)) {
						field.field.attr("title", field.msg);
						field.field.addClass("error-input");
						field.field.addClass("ui-selectmenu-error");
						errores = errores + 1;
						// form.error = field.msg;

					} else {
						if ((field.field.val() == obj.lb_id_year.field.val() || field.field
								.val() == obj.born_year.field.val())
								&& (obj.born_year.field.val().length < 4 || obj.born_year.field
										.val().length < 4)) {
							field.field.attr("title", field.msg);
							field.field.addClass("error-input");
							field.field.addClass("ui-selectmenu-error");
							errores = errores + 1;

						} else {

							field.field.removeClass("ui-selectmenu-error");

							if (!form.validate_check(field)) {
								var date = obj.lb_id_year.field.val()
										+ obj.lb_id_month.field.val()
										+ obj.lb_id_day.field.val();
								var t0 = this.validate_date(date);
								var t1 = this.validate_dateBorn_vs_dateExp();
								var t2 = this.validate_date_vs_dateNow(2,
										obj.lb_id_year.field.val());
								var t3 = this.validate_date_vs_dateNow(2,
										obj.lb_id_year.field.val(),
										obj.lb_id_month.field.val(),
										obj.lb_id_day.field.val());
								var t4 = this.validate_date_vs_dateNow(1,
										obj.born_year.field.val(),
										obj.born_month.field.val(),
										obj.born_day.field.val());

								if (t0 && t1 && t2 && t3 && t4) {
									// field.field.attr("title", field.msg);
									// // field.field.addClass("error-input");
									// //
									// field.field_foundation.addClass("ui-selectmenu-error");
									// form.error = field.msg;

									// return false;
								} else {
									field.field.addClass("ui-selectmenu-error");
									errores = errores + 1;
									// form.error = field.msg;
								}
							} else {

								$("#" + propertyName).removeClass(
										"ui-selectmenu-error");
								$("#" + propertyName).attr("title", "");
							}
						}
					}
					break;
				case 14:
					if (form.error == '') {

						if (!this.getLessThan(field.field.val(), "month")) {
							field.field.attr("title", field.msg);
							field.field.addClass("error-input");
							form.error = field.msg;
							// return false;
						}
						{
							field.field.attr("title", "");
							field.field.removeClass("error-input");

						}
					} else {
						// return false;
					}
					break;
				case 15:
					if (form.error == '') {

						if (!this.getLessThan(field.field.val(), "year")) {
							field.field.attr("title", field.msg);
							field.field.addClass("error-input");
							form.error = field.msg;
							// return false;
						}
						{
							field.field.attr("title", "");
							field.field.removeClass("error-input");

						}
					} else {
						// return false;
					}
					break;
				}
				;
			}

			if (errores > 0) {
				return false;
			} else {
				return true;
			}

		},

		validate_onlynumbersspaces : function(value) {
			console.log("Validate only numbers: " + value.field.val());
			var regex = /^[a-zA-Z\u00E0-\u00FC\u00C0-\u00DC\s]+$/;
			if (regex.test(value.field.val())) {
				return true;
			}
			return false;
		},

		validate_numeric : function(value) {
			// console.log($.isNumeric( value.field.val()));
			return $.isNumeric(value.field.val());
		},

		validate_greater_lower : function(field) {

			/* with the library */
			var num = parseInt(field.field.unmask());

			if (field.lower_or_greater == "greater") {
				if (num > field.than) {
					return true;
				}
			} else {
				if (num < field.than) {
					return true;
				}
			}

			return false;

		},

		validate_phone : function(value, flag) {

			var cadena = value.field.val();
			if (cadena.length == 10) {
				if (cadena[0] == 3) {
					if (cadena.length != flag) {
						if (cadena[1] != cadena[flag]) {
							return true;
						} else {
							return form.validate_phone(value, ++flag);
						}
					}
				}
			}
			return false;
		},

		validate_obligatory : function(value) {

			if (value.field.val() == '') {
				return false;
			}
			return true;
		},

		validate_check : function(value) {
			return value.field.prop("checked");
		},

		validate_EmailAddress : function(value) {
			  var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
			    return pattern.test(value.field.val());
		},

		validate_age : function(age) {

			var mome = moment(age, "YYYYMMDD").fromNow(true);
			var ago = parseInt(mome);

			if (ago >= 18 && ago <= 80) {
				form.edad = ago;
				form.error = "";
				return true;
			}

			if (ago > 80) {
				form.error = "Lo sentimos, la edad m\u00E1xima requerida es 80 a\u00F1os.";
			} else {
				form.error = "Lo sentimos, la edad m\u00EDnima requerida es 18 a\u00F1os.";
			}
			return false;
		},

		validate_issue_date : function(issue_date) {
			console.log("adasdasdsa: " + issue_date);
			if (moment().diff(moment(issue_date, "YYYYMMDD"), 'years') < 18) {
				return false;
			} else {
				return true;
			}
		},

		validate_date : function(date) {

			var validation = moment(date, "YYYYMMDD").isValid();
			if (validation) {
				form.error = "";
			} else {
				form.error = "Por favor, digite un fecha valida";
			}

			return validation;
		},

		validate_dateBorn_vs_dateExp : function() {
			$("#lb_bir_day,#lb_bir_month,#lb_bir_year").removeClass(
					"error-input");
			$("#lb_id_day,#lb_id_month,#lb_id_year").removeClass("error-input");

			var validation = true;
			var msg1 = 'La fecha de expedici\u00F3n del documento de identificaci\u00F3n debe ser mayor a la fecha de nacimiento';
			var msg2 = 'La diferencia entre la fecha de nacimiento y la fecha de expedici\u00F3n del documento de identificaci\u00F3n debe ser al menos de 18 a\u00F1os. ';
			var field1 = moment($("#lb_bir_day").val() + ""
					+ $("#lb_bir_month").val() + "" + $("#lb_bir_year").val(),
					"DDMMYYYY");
			var field2 = moment($("#lb_id_day").val() + ""
					+ $("#lb_id_month").val() + "" + $("#lb_id_year").val(),
					"DDMMYYYY");

			if (moment(field1, "YYYYMMDD").diff(moment(field2, "YYYYMMDD"),
					'days') >= 0) {
				form.error = msg1;
				validation = false;
			} else if (moment(field2, "YYYYMMDD").diff(
					moment(field1, "YYYYMMDD"), 'years') < 18) {
				form.error = msg2;
				validation = false;
			}
			if (!validation) {

				$("#error_div1").css('display', 'block');
				$("#lb_bir_day,#lb_bir_month,#lb_bir_year").attr("title",
						form.error).addClass("ui-selectmenu-error");
				$("#lb_id_day,#lb_id_month,#lb_id_year").attr("title",
						form.error).addClass("ui-selectmenu-error");
				form.show_error();
			} else {
				$("#error_div1").css('display', 'none');
				$("#lb_bir_day,#lb_bir_month,#lb_bir_year").attr("title", "")
						.removeClass("ui-selectmenu-error");
				$("#lb_id_day,#lb_id_month,#lb_id_year").attr("title", "")
						.removeClass("ui-selectmenu-error");
				form.hide_error();

			}
			return validation;
		},
		
		validate_number_phone:function(num){
			if (num != "" &&  num.length < 7 ){
				//com.bbva.main.validate.Validate.error = "Si ingresas t\u00e9lefono debe tener minimo 7 digitos";
				return false;
			}else{
				//com.bbva.main.validate.Validate.error = "";
				return true;
			}		
		},

		validate_date_vs_dateNow : function(type_date, year, month, day) {
			$("#lb_bir_day,#lb_bir_month,#lb_bir_year").removeClass(
					"error-input");
			$("#lb_id_day,#lb_id_month,#lb_id_year").removeClass("error-input");
			var validation = true;

			var nowDate = moment();
			var fieldDate = moment(year + month + day, "YYYY-MM-DD");
			var ago = parseInt(moment(year + month + day, "YYYYMMDD").fromNow(
					true));

			if (fieldDate > nowDate) {
				switch (type_date) {
				case 1:
					form.error = 'La fecha de fecha nacimiento debe ser menor a la fecha actual.';
					$("#lb_bir_day,#lb_bir_month,#lb_bir_year").attr("title",
							form.error).addClass("ui-selectmenu-error");
					break;
				case 2:
					form.error = 'La fecha de expedici\u00F3n de tu documento debe ser menor a la fecha actual.';
					$("#lb_id_day,#lb_id_month,#lb_id_year").attr("title",
							form.error).addClass("ui-selectmenu-error");
					break;
				/***************************************************************
				 * case 3:
				 * $("#born_day,#born_month,#born_year").attr("title",form.error).addClass("error-input");
				 * form.error = ' mayor actual XXXXXXX3'; break;
				 **************************************************************/
				}
				$("#error_div1").css('display', 'block');
				form.show_error();
				validation = false;
			} else {
				switch (type_date) {
				case 1:
					if (ago > 80) {
						form.error = 'Lo sentimos, la edad m\u00E1xima requerida es 80 a\u00F1os.';
						$("#lb_bir_day,#lb_bir_month,#lb_bir_year").attr(
								"title", form.error).addClass("error-input");
						$("#error_div1").css('display', 'block');
						form.show_error();
						validation = false;
					}
					break;
				case 2:
					if (ago > 62) {
						form.error = 'La fecha de expedici\u00F3n de tu documento no debe superar los 62 a\u00F1os.';
						$("#lb_id_day,#lb_id_month,#lb_id_year").attr("title",
								form.error).addClass("ui-selectmenu-error");
						$("#error_div1").css('display', 'block');
						form.show_error();
						validation = false;
					}
					break;
				/***************************************************************
				 * case 3:
				 * $("#born_day,#born_month,#born_year").attr("title",form.error).addClass("error-input");
				 * form.error = 'menos de 1900 XXXXXXX3'; break;
				 **************************************************************/
				}
			}
			return validation;
		},

		validar_salario_tipo_situacion_laboral : function() {
			switch (form.situacion_laboral) {
			case 'Independiente':
				var cast = parseInt($('#lb_principalearn_cp').unmask());
				if (cast >= 2000000) {
					form.error = "";
					return true;
				} else {
					form.error = "Lo sentimos, los ingresos fijos m\u00EDnimos de "
							+ form.situacion_laboral + " son $2.000.000.";
					form.show_error();
					return false;
				}

				break;
			case 'Asalariado término indefinido':
			case 'Asalariado término fijo':
			case 'Pensionado':
			case 'Prestador de servicio':

				var cast = parseInt($('#lb_principalearn_cp').unmask());
				if (cast >= 689454) {
					form.error = "";
					return true;
				} else {
					form.error = "Lo sentimos, los ingresos fijos m\u00ednimos de "
							+ form.situacion_laboral + " son $689.454.";
					form.show_error();
					return false;
				}

				break;
			default:
				form.error = "";
				return true;
			}
		},

		validate_0 : function(number) {

			if (number == "0") {
				form.error = "No puedes ingresar valores en $0 en el campo Valor vivienda/arriendo/cuotas hipotecarias*";
				form.show_error();
				return false;
			}
			form.error = "";
			return true;
		},

		validate_diferent_of : function(value) {

			if (value.field.val() != value.not_be) {
				return true;
			}
			form.error = "";
			return false;
		},

		show_error : function() {
			if (form.error != "") {
				$('.alert_pop2').css('display', 'block');
				/* $('.alert_pop2').css('visibility', 'visible'); */
				/* $('.error_msg').css('display', 'block'); */
				$('.error_msg').html(form.error);
				$('.error_msg').animate({
					opacity : 1
				}, 500);
			} else {
				$('.alert_pop2').css('display', 'none');

			}
		},

		show_error2 : function() {
			if (form.error != "") {
				$('.alert_pop3').css('display', 'block');
				/* $('.alert_pop2').css('visibility', 'visible'); */
				/* $('.error_msg').css('display', 'block'); */
				$('.error_msg3').html(form.error);
				$('.error_msg3').animate({
					opacity : 1
				}, 500);
			} else {
				$('.alert_pop3').css('display', 'none');

			}
		},

		hide_error : function() {
			$('.alert_pop2').css('display', 'none');

		}
	}

})(window, document);
