import { Request, Response } from 'express';

import { supabase } from '../../services/supabase';
import Sync from '@models/Sync';

export class SyncController {
  async get(req: Request, res: Response): Promise<Response> {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(400).json({ error: 'Missing authorization token' });
    }

    const auth = await supabase.auth.api.getUser(authorization);

    if (!auth.user) {
      return res.status(401).json({ error: 'Invalid user' });
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
      return res.status(400).json({ error: 'Missing authorization token' });
    }

    const auth = await supabase.auth.api.getUser(authorization);

    if (!auth.user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    if (!scholars) return res.status(400).json({ error: 'Missing scholars data' });

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
