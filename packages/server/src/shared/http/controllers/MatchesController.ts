import { Request, Response } from 'express';

import { getScholarBattles } from '../services/getScholarBattles';
import AppError from 'src/shared/errors/AppError';

export class MatchesController {
  async get(req: Request, res: Response): Promise<Response> {
    const { address } = req.query as { address: string };

    if (!address) {
      throw new AppError('Missing address', 400);
    }

    const data = await getScholarBattles(address);

    return res.json(data);
  }
}
