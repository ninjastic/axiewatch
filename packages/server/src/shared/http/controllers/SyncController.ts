import { Request, Response } from 'express';

import { supabase } from '../../../services/supabase';
import AppError from 'src/shared/errors/AppError';
import Sync from 'models/Sync';

export class SyncController {
  async get(req: Request, res: Response): Promise<Response> {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new AppError('Missing authorization token', 400);
    }

    const auth = await supabase.auth.api.getUser(authorization);

    if (!auth.user) {
      throw new AppError('Invalid user', 401);
    }

    const sync = await Sync.query().findOne({
      user_id: auth.user.id,
    });

    return res.status(200).json({ scholars: sync?.data ?? [] });
  }

  async post(req: Request, res: Response): Promise<Response> {
    const { authorization } = req.headers;
    const { scholars } = req.body;

    if (!authorization) {
      throw new AppError('Missing authorization token', 400);
    }

    const auth = await supabase.auth.api.getUser(authorization);

    if (!auth.user) {
      throw new AppError('Invalid user', 401);
    }

    if (!scholars) {
      throw new AppError('Missing scholars data', 400);
    }

    let sync = await Sync.query().findOne({
      user_id: auth.user.id,
    });

    if (!sync) {
      sync = await Sync.query().insert({
        user_id: auth.user.id,
        data: scholars,
      });

      return res.status(201).json({ scholars: sync.data });
    }

    sync = await sync.$query().patchAndFetch({
      data: scholars,
    });

    return res.status(200).json({ scholars: sync.data });
  }
}
