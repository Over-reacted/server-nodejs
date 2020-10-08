import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import compression from "compression";
import { NotFoundError } from "../errors";
import { Keys } from "../config";
import { errorHandler, requestLoggerMiddleware } from "../middleware";
import { AppRouter } from "./AppRouter";
import "../modules/User/UserController";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(requestLoggerMiddleware);

app.use(AppRouter.getInstance());

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export default app;
