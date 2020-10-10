import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Keys } from "../../config";
import {
  Get,
  Controller,
  UseMiddleware,
  Post,
  Require,
} from "../../decorators/controllers";
import { createUserCommand } from "./useCases";

@Controller("/user")
class UserController {
  @Post("/signup")
  @Require("email", "password", "repeatPassword")
  async login(req: Request, res: Response, next: NextFunction) {
    const command = new createUserCommand();
    const id = await command.invoke(req.body);
    jwt.sign({ id }, Keys.jwtSecret, { expiresIn: "24h" }, (_, token) => {
      res.status(200).send({ token, id });
    });
  }
}

export { UserController };
