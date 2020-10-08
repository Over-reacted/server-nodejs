import Joi from '@hapi/joi';
import { User } from './User.type';
import { UsersRepository } from './UsersRepository';
import { logMethod } from '../../decorators/log';
import { RequestValidationError } from '../../errors/requestValidationError';
import { UniqueConstraintError } from '../../errors/uniqueConstraintError';

export type userAttributes = {
    email: string;
    id: number;
};

export class UserService {
    private dataSource: UsersRepository;
    constructor(dataSource: UsersRepository) {
        this.dataSource = dataSource;
    }

    @logMethod
    async createUser(userInfo: userAttributes) {
        this.validateProperties(userInfo);
        const { email } = this.normalizeProperties(userInfo);
        try {
            const doesUserExist: User = await this.dataSource.getByEmail(email);
            if (doesUserExist) {
                throw new UniqueConstraintError('User', email);
            }
            const result = await this.dataSource.add(email);
            return result;
        } catch (error) {
            throw error;
        }
    }

    validateProperties({ email }: userAttributes) {
        const schema = Joi.object().keys({
            email: Joi.string().email(),
        });

        const { error } = schema.validate({ email });

        if (error) {
            throw new RequestValidationError(error);
        }
    }

    normalizeProperties({ email }: userAttributes) {
        return {
            email: email.toLowerCase(),
        };
    }
}
