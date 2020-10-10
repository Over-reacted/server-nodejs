import { CustomError } from "./customError";
import { Logger } from "../utils";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super("");

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError() {
    Logger.error(this.message);
    return {
      message: `${this.message}`,
    };
  }
}
