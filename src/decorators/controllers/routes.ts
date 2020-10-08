import { Methods } from './Methods';
import { RequestHandler } from 'express';
import { MetadataKeys } from './MetadataKeys';

export interface RouteHandler extends PropertyDescriptor {
    value?: RequestHandler;
}

const routeBinder = (method: string) => (path: string) => (
    target: any,
    key: string,
    desc: RouteHandler
) => {
    Reflect.defineMetadata(MetadataKeys.path, path, target, key);
    Reflect.defineMetadata(MetadataKeys.method, method, target, key);
};

const Get = routeBinder(Methods.get);
const Put = routeBinder(Methods.put);
const Post = routeBinder(Methods.post);
const Del = routeBinder(Methods.del);
const Patch = routeBinder(Methods.patch);

export { Get, Put, Post, Del, Patch };
