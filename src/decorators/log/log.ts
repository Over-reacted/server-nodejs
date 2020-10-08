export const logMethod = (
    target: Object,
    propertyName: string,
    propertyDesciptor: PropertyDescriptor
): PropertyDescriptor => {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = function (...args: any[]) {
        const name = target.constructor.name;
        const params = args.map((a) => JSON.stringify(a)).join();
        const result = method.apply(this, args);
        console.info(
            `Calling: ${name} /// Method: ${propertyName} /// Params: (${params})`
        );
        return result;
    };
    return propertyDesciptor;
};
