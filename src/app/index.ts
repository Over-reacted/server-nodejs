import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import cors from 'cors';
import compression from 'compression';
import { NotFoundError } from '../errors';
import { Keys, corsOptions } from '../config';
import { errorHandler, requestLoggerMiddleware } from '../middleware';
import { AppRouter } from './AppRouter';
import '../modules/User/UserController';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(compression());
app.use(requestLoggerMiddleware);
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [Keys.cookieKey],
    })
);

app.use(AppRouter.getInstance());

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export default app;
