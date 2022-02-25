import { Request, Response } from 'express';

import { getScholarPvp } from '../services/getScholarPvp';
import AppError from 'src/shared/errors/AppError';

export class PveController {
  async get(req: Request, res: Response): Promise<Response> {
    const { address } = req.query as { address: string };

    if (!address) {
      throw new AppError('Missing address', 400);
    }

    const data = await getScholarPvp(address);

    return res.json(data);
  }
}
