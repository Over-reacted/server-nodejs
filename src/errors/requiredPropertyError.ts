import { CustomError } from "./customError";

export class RequiredPropertyError extends CustomError {
  statusCode = 400;
  constructor(public property: string) {
    super("Property is required");

    Object.setPrototypeOf(this, RequiredPropertyError.prototype);
  }

  serializeError() {
    return {
      message: `${this.property} is required!`,
    };
  }
}
