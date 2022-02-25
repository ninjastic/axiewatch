import { Request, Response } from 'express';

import AppError from 'src/shared/errors/AppError';
import { getExplorerTx } from '../services/getExplorerTx';

export class BatchExplorerController {
  async post(req: Request, res: Response): Promise<Response> {
    const { addresses } = req.body as { addresses: string[]; limit: number };

    if (!addresses) {
      throw new AppError('Missing addresses', 400);
    }

    const promises = await Promise.allSettled(
      addresses.map(async address => {
        const data = await getExplorerTx(address);

        return {
          address,
          total: data.total,
          results: data.results,
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
