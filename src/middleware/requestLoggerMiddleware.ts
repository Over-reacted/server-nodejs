import { Request, Response, NextFunction, response } from 'express';

const requestLoggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.info(`${req.method} ${req.originalUrl}`);
    next();
};

export { requestLoggerMiddleware };
