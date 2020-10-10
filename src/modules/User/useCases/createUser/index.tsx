import Joi from "@hapi/joi";
import { logMethod } from "../../../../decorators/log";
import { User } from "../../Model";
import {
  RequestValidationError,
  DatabaseError,
  BadRequestError,
} from "../../../../errors";

export class createUser {
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
    try {
      const user = new User({
        email: normalisedEmail,
        password: normalisedPassword,
      });

      User.findOne({ email: normalisedEmail }, (err, existingUser) => {
        if (err) throw new BadRequestError(err);
        if (existingUser)
          throw new BadRequestError(
            "Account with that email address already exists."
          );

        user.save();

        return user;
      });
    } catch (error) {
      throw new DatabaseError(error.detail);
    }
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
