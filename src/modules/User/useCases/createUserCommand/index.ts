import Joi from "@hapi/joi";
import { logMethod } from "../../../../decorators/log";
import { User } from "../../Model";
import {
  RequestValidationError,
  DatabaseError,
  BadRequestError,
} from "../../../../errors";

export class createUserCommand {
  @logMethod
  async invoke({
    email,
    password,
    repeatPassword,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    repeatPassword: string;
  }) {
    this.validateProperties(email, password, repeatPassword);
    const {
      email: normalisedEmail,
      password: normalisedPassword,
    } = this.normalizeProperties(email, password);

    const doesUserExist = User.findOne({ email: normalisedEmail });

    if (doesUserExist) {
      throw new BadRequestError("User already exists!");
    }

    const user = new User({
      email: normalisedEmail,
      password: normalisedPassword,
    });
    user.save();
    return user;
  }
  validateProperties(email: string, password: string, repeatPassword: string) {
    const schema = Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().min(4).max(12),
    });

    if (repeatPassword !== password) {
      throw new BadRequestError("Passwords do not match!");
    }

    const { error } = schema.validate({ email, password });

    if (error) throw new RequestValidationError(error);
  }

  normalizeProperties(email: string, password: string) {
    return {
      email: email.toLowerCase(),
      password,
    };
  }
}
