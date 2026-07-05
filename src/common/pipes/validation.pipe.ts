import { ValidationPipe as NestValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { EXCEPTION_CODES } from '../exceptions/exception-codes.exceptions.js';
import { BadRequestAppException } from '../exceptions/catalog-exception.js';
import {
  CONSTRAINT_CODE_MAP,
  ValidationErrorMapping,
} from '../validation/validation-error-messages.js';

function buildDetails(errors: ValidationError[]): Array<{
  field: string;
  violations: Array<{ code: string; message: string; originalMessage: string }>;
}> {
  return errors.map((error) => {
    const field = error.property;
    const constraints = error.constraints || {};
    const violations = Object.entries(constraints).map(([constraintKey, originalMessage]) => {
      const mapping: ValidationErrorMapping = CONSTRAINT_CODE_MAP[constraintKey] || {
        code: EXCEPTION_CODES.BAD_REQUEST,
        message: 'Campo inválido',
      };
      return {
        code: mapping.code,
        message: mapping.message,
        originalMessage,
      };
    });
    return { field, violations };
  });
}

export class ValidationPipe extends NestValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors: ValidationError[]) => {
        const details = buildDetails(errors);
        const firstCode = details[0]?.violations[0]?.code || EXCEPTION_CODES.BAD_REQUEST;

        return new BadRequestAppException({
          code: firstCode,
          message: 'Error de validación',
          details,
        });
      },
    });
  }
}
