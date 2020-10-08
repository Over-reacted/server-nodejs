import { ValidationError } from '@hapi/joi';
import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError) {
        super('Invalid request parameters');

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeError() {
        return { message: this.errors.message };
    }
}
