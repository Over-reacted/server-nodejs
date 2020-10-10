import { CustomError } from "./customError";
import { Logger } from "../utils";

export class DatabaseError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super("Property is required");

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serializeError() {
    Logger.error(this.message);
    return {
      message: `${this.message}`,
    };
  }
}
