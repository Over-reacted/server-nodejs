import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { Keys } from './config/keys';
import './models/User';
import './config/passport';

mongoose.connect(Keys.mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

const app = express();
app.use(cors());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [Keys.cookieKey],
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send(req.body);
});

app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['email'],
    })
);

app.get('/auth/google/callback', passport.authenticate('google'));

app.get('/api/logout', (req: Request, res: Response) => {
    req.logout();
    res.send(req.user);
});

app.get('/api/current_user', (req: Request, res: Response) => {
    res.send(req.user);
});

export default app;
