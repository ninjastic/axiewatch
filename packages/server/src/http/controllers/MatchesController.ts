import { Request, Response } from 'express';

import { getScholarBattles } from '../services/getScholarBattles';

export class MatchesController {
  async get(req: Request, res: Response): Promise<Response> {
    const { address } = req.query as { address: string };

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    const data = await getScholarBattles(address);

    return res.json(data);
  }
}
