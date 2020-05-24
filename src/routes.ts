import { Router } from 'express';
import { Alive, Engine } from './controllers';

const routes = Router();

routes.get('/search', Engine.search);

routes.get('/ping', Alive.ping);

export default routes;
