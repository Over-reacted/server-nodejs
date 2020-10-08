import Postgres from '../../config/Postgres';
import { User } from './User.type';
import { logMethod } from '../../decorators/log';

class UsersRepository {
    @logMethod
    async add(email: string) {
        const statement = 'INSERT INTO users(email) VALUES($1) RETURNING id';
        try {
            const { rows } = await Postgres.query(statement, [email]);
            return rows[0].id;
        } catch (error) {
            throw error;
        }
    }

    @logMethod
    async getByEmail(email: string): Promise<User> {
        const statement = 'SELECT email FROM users WHERE email = $1';
        try {
            const { rows } = await Postgres.query(statement, [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

export { UsersRepository };
