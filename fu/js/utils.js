if (!String.prototype.trim) {
	(function() {
		var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
		String.prototype.trim = function() {
			return this.replace(rtrim, '');
		};
	})();
}

if (!String.prototype.middleTrim) {
	(function() {
		var rtrim = /[\s\uFEFF\xA0]+/g;
		String.prototype.middleTrim = function() {
			return this.trim().replace(rtrim, ' ');
		};
	})();
}

function isControlChar(chr) {
	return chr <= 31;
}

function isMinControlChar(chr) {
	// Tab y Backspace
	return chr == 8 || chr == 9;
}

function isNumberChar(chr) {
	return chr >= 48 && chr <= 57;
}

function isLowerCaseChar(chr) {
	return chr >= 65 && chr <= 90;
}

function isUpperCaseChar(chr) {
	return chr >= 97 && chr <= 122;
}

function isCharInString(chr, str) {
	return str.indexOf(String.fromCharCode(chr)) != -1;
}

function isRutChar(chr) {
	return isNumberChar(chr) || chr == 75 || chr == 107
}

function isNameChar(chr) {
	// Se permiten minusculas, mayusculas, espacios y letras con acento
	return isLowerCaseChar(chr) || isUpperCaseChar(chr) || chr == 32 || isCharInString(chr, "\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1\u00E1\u00E9\u00ED\u00F3\u00FA\u00FC\u00F1\u0461");
}

function isEmailChar(chr) {
	// Se permiten minusculas, mayusculas, numeros, punto, arroba y guion bajo
	return isLowerCaseChar(chr) || isUpperCaseChar(chr) || isNumberChar(chr) || chr == 46 || chr == 64 || chr == 95;
}

function unformatRut(rut) {
	rut = rut + "";
	rut = rut.replace(/[^0-9Kk]/g, "");
	rut = rut.replace(/^0+/, "");
	return rut.toUpperCase();
}

function formatRut(rut) {
	rut = unformatRut(rut);
	var cont = 0;
	var format = "";
	if (rut.length > 1) {
		format = "-" + rut.substring(rut.length - 1);
	} else {
		format = rut.substring(rut.length - 1);
	}
	for (var i = rut.length - 2; i >= 0; i--) {
		format = rut.substring(i, i + 1) + format;
		cont++;
		if (cont === 3 && i !== 0) {
			format = "." + format;
			cont = 0;
		}
	}
	return format;
}

function getRutNumber(rut) {
	rut = unformatRut(rut);
	var pos = rut.length - 1;
	return parseInt(rut.substring(0, pos));
}

function calculateDvr(rut) {
	var mul = 0
	var dvr = 1;
	while (rut) {
		dvr = (dvr + rut % 10 * (9 - mul++ % 6)) % 11;
		rut = Math.floor(rut / 10);
	}
	return dvr ? (dvr - 1) + "" : 'K';
}

function isValidRut(val) {
	val = val + "";
	if (!/^\d{1,3}(\.\d{3})*-[\dKk]$/.test(val) && !/^\d+-?[\dKk]$/.test(val)) {
		return false;
	}
	var pos = val.length - 1;
	return val.charAt(pos) == calculateDvr(getRutNumber(val));
}

function isValidPhone(val) {
	return /^\d{9}$/.test(val + "");
}

function isValidEmail(val) {
	return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			.test(val);
}

function clearFieldError(field) {
	$(field).removeClass("error-input");
}

function showFieldError(field) {
	$(field).addClass("error-input");
}

function hasInvalidFields(elem) {
	elem = elem || document;
	return $(elem).find(".error-input").length != 0;
}

function trimFieldValue(field) {
	return $(field).val($(field).val().middleTrim()).val();
}

function validateNameFiled(field) {
	if (trimFieldValue(field) === "") {
		showFieldError(field);
		return false;
	}
	return true;
}

function validateRutField(field) {
	var val = trimFieldValue(field);
	if (val === "" || !isValidRut(val)) {
		showFieldError(field);
		return false;
	}
	return true;
}

function validatePhoneField(field) {
	var val = trimFieldValue(field);
	if (val === "" || !isValidPhone(val)) {
		showFieldError(field);
		return false;
	}
	return true;
}

function validateEmailField(field) {
	var val = trimFieldValue(field);
	if (val === "" || !isValidEmail(val)) {
		showFieldError(field);
		return false;
	}
	return true;
}

utilsNumber = {
	SEP_DECIMAL : ',',
	SEP_MILES : '.',
	fixSepMil : function (sepMil) {
		return sepMil || utilsNumber.SEP_MILES;
	},

	fixSepDec : function (sepDec) {
		return sepDec || utilsNumber.SEP_DECIMAL;
	},

	descomponer : function (numero, sepDec) {
		var signo = '';
		var entero = '';
		var decimal = '';
		numero = $.trim(numero);
		if (numero.charAt(0) == '-') {
			signo = numero.charAt(0);
			numero = numero.substr(1);
		}
		var pos = numero.indexOf(utilsNumber.fixSepDec(sepDec));
		if (pos > 0) {
			entero = numero.substr(0, pos);
			decimal = numero.substr(pos + 1);
		} else if (pos === 0) {
			decimal = numero.substr(1);
		} else {
			entero = numero;
		}
		return {
			'signo' : signo,
			'entero' : entero,
			'decimal' : decimal
		};
	},

	componer : function (jsonNumero, sepDec) {
		var numero = jsonNumero.signo + (jsonNumero.entero || '0') + (jsonNumero.decimal ? utilsNumber.fixSepDec(sepDec) + jsonNumero.decimal : '');
		return numero == '-0' ? '0' : numero;
	},

	quitarSeparadorMiles : function (numero, sepMil) {
		var buscar = new RegExp('\\' + utilsNumber.fixSepMil(sepMil), 'g');
		return numero.replace(buscar, '');
	},

	agregarSeparadorMiles : function (numero, sepMil, sepDec) {
		numero = utilsNumber.quitarSeparadorMiles(numero, sepMil);
		var jsonNumero = utilsNumber.descomponer(numero, sepDec);
		if (jsonNumero.entero === '') {
			jsonNumero.entero = '0';
		} else {
			for (var i = 0; i < Math.floor((jsonNumero.entero.length - (1 + i)) / 3); i++) {
				var pos = jsonNumero.entero.length - (4 * i + 3);
				jsonNumero.entero = jsonNumero.entero.substring(0, pos) + utilsNumber.fixSepMil(sepMil) + jsonNumero.entero.substring(pos);
			}
		}
		return utilsNumber.componer(jsonNumero, sepDec);
	},

	quitarCeros : function (numero, izquierda, derecha, sepDec) {
		var jsonNumero = utilsNumber.descomponer(numero, sepDec);
		if (izquierda) {
			jsonNumero.entero = jsonNumero.entero.replace(/^[0\D]+/, '');
		}
		if (derecha) {
			jsonNumero.decimal = jsonNumero.decimal.replace(/[0\D]+$/, '');
		}
		return utilsNumber.componer(jsonNumero, sepDec);
	},

	quitarCerosSobrantes : function (numero, sepDec) {
		return utilsNumber.quitarCeros(numero, true, true, sepDec);
	},

	rellenarCeros : function (numero, cantidad, derecha) {
		var str = numero + "";
		var repetir = cantidad - str.length;
		var relleno = '';
		for (var i = 0; i < repetir; i++) {
			relleno += '0';
		}
		return derecha ? str + relleno : relleno + str;
	},

	agregarCeros : function (numero, izquierda, derecha, sepDec) {
		var jsonNumero = utilsNumber.descomponer(numero, sepDec);
		if (izquierda) {
			jsonNumero.entero = utilsNumber.rellenarCeros(jsonNumero.entero, izquierda);
		}
		if (derecha) {
			jsonNumero.decimal = utilsNumber.rellenarCeros(jsonNumero.decimal, derecha, true);
		}
		return utilsNumber.componer(jsonNumero, sepDec);
	},

	numberToFormat : function (numero, decimales, sepMil, sepDec) {
		//convierte un number js (1234.56) en un string formateado ("1.234,56")
		sepMil = utilsNumber.fixSepMil(sepMil);
		sepDec = utilsNumber.fixSepDec(sepDec);
		numero = decimales ? numero.toFixed(decimales) : ('' + numero);
		numero = numero.replace('.', sepDec);
		numero = utilsNumber.agregarCeros(numero, 0, decimales, sepDec);
		return utilsNumber.agregarSeparadorMiles(numero, sepMil, sepDec);
	},

	formatToNumber : function (numero, decimales, sepMil, sepDec) {
		//convierte un string formateado ("1.234,56") en un number js (1234.56)
		sepMil = utilsNumber.fixSepMil(sepMil);
		sepDec = utilsNumber.fixSepDec(sepDec);
		numero = utilsNumber.quitarSeparadorMiles(numero, sepMil);
		numero = utilsNumber.quitarCerosSobrantes(numero, sepDec);
		numero = numero.replace(sepDec, '.');
		numero = parseFloat(numero);
		return decimales ? parseFloat(numero.toFixed(decimales)) : numero;
	},

	bigNumberToFormat : function (numero, decimales, sepMil, sepDec) {
		sepMil = utilsNumber.fixSepMil(sepMil);
		sepDec = utilsNumber.fixSepDec(sepDec);
		numero = numero.setScale(decimales).toString();
		numero = numero.replace(BigNumber.DECIMAL_SEPARATOR, sepDec);
		numero = utilsNumber.agregarCeros(numero, 0, decimales, sepDec);
		return utilsNumber.agregarSeparadorMiles(numero, sepMil, sepDec);
	},

	formatToBigNumber : function (numero, decimales, sepMil, sepDec) {
		sepMil = utilsNumber.fixSepMil(sepMil);
		sepDec = utilsNumber.fixSepDec(sepDec);
		numero = utilsNumber.quitarSeparadorMiles(numero, sepMil);
		numero = utilsNumber.quitarCerosSobrantes(numero, sepDec);
		numero = numero.replace(sepDec, BigNumber.DECIMAL_SEPARATOR);
		return new BigNumber(numero, decimales);
	},

	format : function (numero, decimales, sepMil, sepDec) {
		//convierte un string numerico ("1234,56") en un string formateado ("1.234,56")
		numero = utilsNumber.formatToNumber(numero, decimales, sepMil, sepDec);
		return utilsNumber.numberToFormat(numero, decimales, sepMil, sepDec);
	},

	unformat : function (numero, decimales, sepMil, sepDec) {
		//convierte un string formateado ("1.234,56") en un string numerico ("1234,56")
		numero = utilsNumber.formatToNumber(numero, decimales, sepMil, sepDec);
		numero = decimales ? numero.toFixed(decimales) : ('' + numero);
		return numero.replace('.', sepDec);
	}
};