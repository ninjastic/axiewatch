import { Request, Response } from 'express';

import AppError from '@src/shared/errors/AppError';
import { getScholar } from '../services/getScholar';
import { getScholarPvp } from '../services/getScholarPvp';
import { getScholarHistoricalSlp } from '../services/getScholarHistoricalSlp';
import { getScholarAdventure } from '../services/getScholarAdventure';

export class BatchScholarController {
  async post(req: Request, res: Response): Promise<Response> {
    const { addresses } = req.body as { addresses: string[] };

    if (!addresses) {
      throw new AppError('Missing addresses', 400);
    }

    const promises = await Promise.allSettled(
      addresses.map(async address => {
        const scholar = await getScholar(address);

        const pvp = await getScholarPvp(address).catch(() => null);
        const pve = await getScholarAdventure(address).catch(() => null);
        const historical = await getScholarHistoricalSlp(address).catch(() => null);

        return {
          address,
          scholar,
          pvp,
          pve,
          historical,
        };
      })
    );

    const data = promises.map((promise, index) => {
      if (promise.status === 'fulfilled') {
        return promise.value;
      }

      return {
        address: addresses[index],
        error: true,
      };
    });

    return res.json(data);
  }
}
