import { CustomError } from './customError';

export class BadRequestError extends CustomError {
    statusCode = 400;
    constructor(public message: string) {
        super('');

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeError() {
        return {
            message: `${this.message}`,
        };
    }
}
