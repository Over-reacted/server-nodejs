import { MetadataKeys } from './MetadataKeys';

const Require = (...keys: string[]) => (
    target: any,
    key: string,
    desc: PropertyDescriptor
) => {
    Reflect.defineMetadata(MetadataKeys.validator, keys, target, key);
};

export { Require };
