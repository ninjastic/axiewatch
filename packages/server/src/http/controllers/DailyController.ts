import { Request, Response } from 'express';

import { supabase } from '@src/services/supabase';
import Sync from '@src/models/Sync';
import { getScholarHistoricalSlp } from '../services/getScholarHistoricalSlp';

export class DailyController {
  async get(req: Request, res: Response): Promise<Response> {
    const { address } = req.query as { address: string };
    const authorization = req.get('authorization');

    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }

    if (!address) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let isTracking: boolean | null = null;

    const { user } = await supabase.auth.api.getUser(authorization ?? '');

    if (user) {
      isTracking = !!(await Sync.query()
        .select('id')
        .where('user_id', user.id)
        .then(response => response));
    }

    const { dates } = await getScholarHistoricalSlp(address);

    const data = {
      dates,
      isTracking,
    };

    return res.json(data);
  }
}
