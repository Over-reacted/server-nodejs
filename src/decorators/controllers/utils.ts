import { MetadataKeys } from './MetadataKeys';
import { RequestHandler, Response, NextFunction, Request } from 'express';
import { RequiredPropertyError } from '../../errors/requiredPropertyError';

export const validateBodyParameters = (keys: string): RequestHandler => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body) {
        return res.status(400).send({ message: 'Invalid request!' });
    }

    for (let key of keys) {
        if (!req.body[key]) {
            throw new RequiredPropertyError(key);
        }
    }
    next();
};

export const getBodyParameters = (target: Function, key: string) => {
    return Reflect.getMetadata(MetadataKeys.validator, target, key) || [];
};

export const getMiddlewares = (target: Function, key: string) => {
    return Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];
};

export const getMethod = (target: Function, key: string) => {
    return Reflect.getMetadata(MetadataKeys.method, target, key);
};

export const getPath = (target: Function, key: string) => {
    return Reflect.getMetadata(MetadataKeys.path, target, key);
};
