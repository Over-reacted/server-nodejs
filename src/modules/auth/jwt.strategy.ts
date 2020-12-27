import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from './../config';
import { CustomersService } from '../customer';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly customersService: CustomersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate({ iat, exp, customerId }: any, done) {
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const customer = await this.customersService.get(customerId);

    const isEmailConfirmed = await this.customersService.isEmailConfirmed(customer);

    if (!(customer || isEmailConfirmed)) {
      throw new UnauthorizedException();
    }

    delete customer.password;
    done(null, customer);
  }
}
