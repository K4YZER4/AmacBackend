import { EXCEPTION_CODES } from '../exceptions/exception-codes.exceptions.js';

export interface ValidationErrorMapping {
  code: string;
  message: string;
}

export const CONSTRAINT_CODE_MAP: Record<string, ValidationErrorMapping> = {
  isNotEmpty: { code: EXCEPTION_CODES.REQUIRED_FIELD, message: 'El campo es requerido' },
  isString: { code: EXCEPTION_CODES.INVALID_FORMAT, message: 'Debe ser un texto' },
  isInt: { code: EXCEPTION_CODES.INVALID_FORMAT, message: 'Debe ser un número entero' },
  isNumber: { code: EXCEPTION_CODES.INVALID_FORMAT, message: 'Debe ser un número' },
  isBoolean: { code: EXCEPTION_CODES.INVALID_FORMAT, message: 'Debe ser un valor booleano' },
  isDateString: { code: EXCEPTION_CODES.INVALID_FORMAT, message: 'Debe ser una fecha válida' },
  isEmail: {
    code: EXCEPTION_CODES.INVALID_EMAIL,
    message: 'Debe ser un correo electrónico válido',
  },
  min: { code: EXCEPTION_CODES.INVALID_VALUE, message: 'Valor mínimo no cumplido' },
  max: { code: EXCEPTION_CODES.INVALID_VALUE, message: 'Valor máximo excedido' },
  minLength: { code: EXCEPTION_CODES.INVALID_LENGTH, message: 'Longitud mínima no cumplida' },
  maxLength: { code: EXCEPTION_CODES.INVALID_LENGTH, message: 'Longitud máxima excedida' },
  matches: { code: EXCEPTION_CODES.INVALID_FORMAT, message: 'Formato inválido' },
  isIn: { code: EXCEPTION_CODES.INVALID_VALUE, message: 'Valor no permitido' },
};
