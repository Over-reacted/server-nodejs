import { Request, Response } from 'express';

class HomeController {
    getHome(req: Request, res: Response) {
        res.send({ test: 'gosho' });
    }
}

export { HomeController };
