import { ValidationError } from "@hapi/joi";
import { CustomError } from "./customError";
import { Logger } from "../utils";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError() {
    Logger.error(this.errors.message);
    return { message: this.errors.message };
  }
}
