import { Request, Response } from 'express';

import { supabase } from 'src/services/supabase';
import AppError from 'src/shared/errors/AppError';
import Sync from 'src/models/Sync';
import { getScholarHistoricalSlp } from '../services/getScholarHistoricalSlp';

export class DailyController {
  async get(req: Request, res: Response): Promise<Response> {
    const { address } = req.query as { address: string };
    const authorization = req.get('authorization');

    if (!address) {
      throw new AppError('Missing address', 400);
    }

    if (!address) {
      throw new AppError('Unauthorized', 401);
    }

    let isTracking: boolean | null = null;

    const { user } = await supabase.auth.api.getUser(authorization ?? '');

    if (user) {
      isTracking = !!(await Sync.query()
        .findOne('user_id', user.id)
        .then(response => response?.data.find(scholar => scholar.address === address)));
    }

    const { dates } = await getScholarHistoricalSlp(address);

    const data = {
      dates,
      isTracking,
    };

    return res.json(data);
  }
}
