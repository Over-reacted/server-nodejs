require("dotenv").config();
import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import compression from "compression";
import mongoose from "mongoose";

import { NotFoundError } from "../errors";
import { Keys } from "../config";
import { errorHandler, requestLoggerMiddleware } from "../middleware";
import { AppRouter } from "./AppRouter";

if (!Keys.dbHost) throw new Error("Connection string is required!");

const app = express();
mongoose
  .connect(Keys.dbHost, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    // process.exit();
  });

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
