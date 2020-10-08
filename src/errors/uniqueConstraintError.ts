import { CustomError } from './customError';

export class UniqueConstraintError extends CustomError {
    statusCode = 400;
    constructor(public entity: string, public param: string) {
        super('Entity with such parameter already exists');

        Object.setPrototypeOf(this, UniqueConstraintError.prototype);
    }

    serializeError() {
        return {
            message: `${this.entity} with parameter ${this.param} already exists or is marked as deleted!`,
        };
    }
}
