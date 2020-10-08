import { CustomError } from './customError';

export class DatabaseError extends CustomError {
    statusCode = 400;
    constructor(public message: string) {
        super('Property is required');

        Object.setPrototypeOf(this, DatabaseError.prototype);
    }

    serializeError() {
        return {
            message: `${this.message}`,
        };
    }
}
