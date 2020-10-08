import { MetadataKeys } from './MetadataKeys';
import { RequestHandler, ErrorRequestHandler } from 'express';
import { getMiddlewares } from './utils';

const UseMiddleware = (middleware: RequestHandler | ErrorRequestHandler) => (
    target: any,
    key: string,
    desc: PropertyDescriptor
) => {
    Reflect.defineMetadata(
        MetadataKeys.middleware,
        [...getMiddlewares(target, key), middleware],
        target,
        key
    );
};

export { UseMiddleware };
