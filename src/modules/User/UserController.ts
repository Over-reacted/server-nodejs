import { Request, Response, NextFunction } from 'express';
import {
    Get,
    Controller,
    UseMiddleware,
    Post,
    Require,
} from '../../decorators/controllers';
import { UsersRepository } from './UsersRepository';
import { UserService } from './UserService';

const dataSource = new UserService(new UsersRepository());

@Controller('/auth')
class UserController {
    @Get('/login')
    getLogin(req: Request, res: Response): void {
        res.send(`
      <form method="POST">
        <div>
          <label>Email</label>
          <input name="emil" />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" />
        </div>
        <button>Submit</button>
      </form>
    `);
    }

    @Post('/login')
    @Require('email', 'password')
    async postLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const id = await dataSource.createUser(req.body);
            res.status(200).send({ id });
        } catch (error) {
            throw error;
        }
    }
}

export { UserController };
