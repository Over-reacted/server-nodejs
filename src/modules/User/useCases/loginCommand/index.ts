import Joi from "@hapi/joi";
import bcrypt from "bcrypt";
import { logMethod } from "../../../../decorators/log";
import { User } from "../../Model";
import { RequestValidationError, BadRequestError } from "../../../../errors";

export class loginCommand {
  @logMethod
  async invoke({
    email,
    password,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    this.validateProperties(email, password);

    const normalisedEmail = this.normalizeEmail(email);
    const userExists = await User.findOne({ email: normalisedEmail }).exec();

    if (userExists) {
      let comparePass = bcrypt.compareSync(password, userExists.password);
      if(comparePass){
        return userExists.id;
      }
    }

     throw new BadRequestError("Invalid credentials");
  }

  validateProperties(email: string, password: string) {
    const schema = Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().min(4).max(12),
    });

    const { error } = schema.validate({ email, password });
    if (error) throw new RequestValidationError(error);
  }

  normalizeEmail(email: string): string {
    return email.toLowerCase();
  }
}
