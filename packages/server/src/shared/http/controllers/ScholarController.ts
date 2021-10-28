import { Request, Response } from 'express';

import { getScholar } from '../services/getScholar';
import { getScholarPvp } from '../services/getScholarPvp';
import { getScholarHistoricalSlp } from '../services/getScholarHistoricalSlp';
import { getScholarAdventure } from '../services/getScholarAdventure';

export class ScholarController {
  async get(req: Request, res: Response): Promise<Response> {
    const { address } = req.query as { [address: string]: string };

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    const scholar = await getScholar(address);

    const pvp = await getScholarPvp(address).catch(() => null);
    const pve = await getScholarAdventure(address).catch(() => null);
    const historical = await getScholarHistoricalSlp(address).catch(() => null);

    const data = {
      address,
      scholar,
      pvp,
      pve,
      historical,
    };

    return res.json(data);
  }
}
