import Joi from "@hapi/joi";
import bcrypt from "bcrypt";
import { logMethod } from "../../../../decorators/log";
import { User } from "../../Model";
import { RequestValidationError, BadRequestError } from "../../../../errors";

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

    const userExists = await User.findOne({ email: normalisedEmail }).exec();
    if (userExists) throw new BadRequestError("User already exists!");

    const user = new User({
      email: normalisedEmail,
      password: normalisedPassword,
    });

    user.save((err) => {
      if (err) throw new BadRequestError(err);
    });
    return user.id;
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
    password = bcrypt.hashSync(password, 10);
    return {
      email: email.toLowerCase(),
      password,
    };
  }
}
