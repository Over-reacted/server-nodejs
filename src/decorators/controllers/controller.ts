import { AppRouter } from '../../app/AppRouter';
import { Methods } from './Methods';
import {
    getBodyParameters,
    validateBodyParameters,
    getMiddlewares,
    getMethod,
    getPath,
} from './utils';

const Controller = (route: string) => (target: Function) => {
    for (let key in target.prototype) {
        const method: Methods = getMethod(target.prototype, key);
        if (getPath(target.prototype, key)) {
            AppRouter.getInstance()[method](
                `${route}${getPath(target.prototype, key)}`,
                ...getMiddlewares(target.prototype, key),
                validateBodyParameters(
                    getBodyParameters(target.prototype, key)
                ),
                target.prototype[key]
            );
        }
    }
};

export { Controller };
