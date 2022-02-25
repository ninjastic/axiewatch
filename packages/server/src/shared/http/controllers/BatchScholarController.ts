import { Request, Response } from 'express';

import AppError from 'src/shared/errors/AppError';
import { getScholar } from '../services/getScholar';
import { getScholarPvp } from '../services/getScholarPvp';
import { getScholarAdventure } from '../services/getScholarAdventure';
import { getScholarHistoricalBatch } from '../services/getScholarHistoricalBatch';

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

        return {
          address,
          scholar,
          pvp,
          pve,
        };
      })
    );

    const historical = await getScholarHistoricalBatch(addresses);

    const data = promises.map((promise, index) => {
      if (promise.status === 'fulfilled') {
        return { ...promise.value, historical: historical[promise.value.address] };
      }

      return {
        address: addresses[index],
        error: true,
      };
    });

    return res.json(data);
  }
}
