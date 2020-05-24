import { Request, Response } from 'express';

class Alive {

  public ping(_: Request, res: Response) {
    return res.json({ ping: 'pong'});
  }
}

export default new Alive();
