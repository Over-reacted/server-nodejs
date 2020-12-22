import { createHmac } from 'crypto';import { ValueTransformer } from 'typeorm';

export class PasswordTransformer implements ValueTransformer {
  to(value: any) {
    return createHmac('sha256', value).digest('hex');
  }
  from(value: any) {
    return value;
  }
}
