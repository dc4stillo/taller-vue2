'use strict';

const i18n = {
  'validation': {
    'message': 'Revise que todos los campos sean correctos',
    'required': 'El campo es requerido',
    'validationIsEmailFailed': 'El campo no es un correo electrónico válido',
    'validationIsEmailOnEmailFailed': 'El campo no es un correo electrónico válido',
    'nit': 'El campo no es un NIT válido',
    'date': 'El campo no es una fecha válida',
    'date_less_than': 'El campo debe contener una fecha menor a la fecha actual',
    'date_greater_than': 'El campo debe contener una fecha mayor a la fecha actual',
    'data_date_less_than': 'El campo debe contener una fecha no menor a {0} días.',
    'data_date_greater_than': 'El campo debe contener una fecha no mayor a {0} días',
    'data_minlength': 'El campo debe contener un mínimo de {0} carácteres',
    'data_min': 'El campo debe contener un valor mayor igual a {0}',
    'data_max': 'El campo debe contener un valor menor igual a {0}',
    'data_exactlength': 'El campo debe tener exactamente {0} carácteres',
    'data_matches': 'El campo no concuerda con el campo {0}',
    'alpha': 'El campo sólo puede contener carácteres alfabéticos',
    'alpha_numeric': 'El campo sólo puede contener carácteres alfanuméricos',
    'alpha_dash': 'El campo sólo puede contener carácteres alfanuméricos, guiones bajos "_" o guiones "-"',
    'validationIsNumericFailed': 'El campo sólo puede contener números',
    'integer': 'El campo debe contener un número entero',
    'matches': 'El campo no concuerda con el campo {0}',
    'is_natural': 'El campo debe contener sólo números positivos.',
    'no_zero': 'El campo debe contener un número mayor a cero',
    'decimal': 'El campo debe contener un número decimal',
    'unique': 'Este valor ya fue registrado anteriormente'
  }
};

class ValidationError extends Error {
  constructor (message, offendingProperty) {
    super();

    this.name = 'ValidationError';
    this.message = message || '';
    this.statusCode = 422;
    if (offendingProperty) {
      this.property = offendingProperty;
    }
    this.errorType = this.name;
  }
}

function getText (oError) {
  let text = '';
  for (let key in oError) {
    text += '- ' + oError[key].label + ': ' + oError[key].errors.join(', ') + '.\n';
  }
  return text;
}

function convertKey (message) {
  let arr = message.split(' ');
  arr.map(function (el, i) {
    if (i === 0) {
      arr[i] = el.toLowerCase();
    } else {
      arr[i] = el.substring(0, 1).toUpperCase() + el.substring(1);
    }
  });
  return arr.join('');
}

// Hook genérico para los errores de validación
function validate (sequelize) {
  sequelize.addHook('validationFailed', (instance, options, error, fn) => {
    let err = error.errors;
    let oError = {};

    for (let i in err) {
      let key = err[i].path;
      let type = err[i].type;
      let message = '';

      if (type === 'notNull Violation') {
        message = 'El campo es requerido';
      } else if (type === 'Validation error') {
        message = i18n.validation[convertKey(err[i].message)] || err[i].message;
      } else {
        throw new Error('Ocurrió un error interno');
      }

      if (oError[key]) {
        oError[key].err.push(message);
      } else {
        oError[key] = {
          'errors': [message]
        };
      }
      oError[key].label = key;
    }
    throw new ValidationError(i18n.validation.message + ':\n' + getText(oError));
  });
}

module.exports = {
  validate
};
