import cors from 'cors';
import express from 'express';
import routes from './routes';

class App {
  public express: express.Application;
  public constructor() {
    this.express = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  private settings(): void {
    this.express.disable('x-powered-by');
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private routes(): void {
    this.express.use(routes);
  }
}

export default new App().express;
