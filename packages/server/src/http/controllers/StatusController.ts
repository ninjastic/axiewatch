import { Request, Response } from 'express';

import { getGameStatus } from '../services/getGameStatus';

export class StatusController {
  async get(req: Request, res: Response): Promise<Response> {
    const status = await getGameStatus();

    return res.json(status);
  }
}
