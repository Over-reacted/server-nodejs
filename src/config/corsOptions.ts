import { CorsOptions } from 'cors';
import { Keys } from './keys';

export const corsOptions: CorsOptions = {
    origin: Keys.allowedOrigin,
};
