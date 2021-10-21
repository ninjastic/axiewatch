import { Request, Response } from 'express';

import { getScholarPvp } from '../services/getScholarPvp';

export class PveController {
  async get(req: Request, res: Response): Promise<Response> {
    const { address } = req.query as { address: string };

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    const data = await getScholarPvp(address);

    return res.json(data);
  }
}
