import chalk from "chalk";
import { Logger } from "./logger";

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
    Logger.info(
      `Calling: ${name} /// Method: ${propertyName} /// Params: (${params})`
    );
    return result;
  };
  return propertyDesciptor;
};
