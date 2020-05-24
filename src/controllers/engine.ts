import { Query } from '../types';
import { Request, Response } from 'express';
import { Autoline, Icarros } from '../resolvers';

class Engine {

  public async search(req: Request, res: Response): Promise<object> {
    const { query } = req;

    const result = await Promise.all([
      Autoline.run(query as Query),
      Icarros.run(query as Query)
    ]);

    return res.json(result.flat());
  }
}

export default new Engine();
