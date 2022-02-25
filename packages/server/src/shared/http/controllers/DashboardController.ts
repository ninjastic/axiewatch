import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

import { supabase } from '../../../services/supabase';
import AppError from 'src/shared/errors/AppError';
import Dashboard from 'models/Dashboard';
import Sync from 'models/Sync';

export class DashboardController {
  async get(req: Request, res: Response): Promise<Response> {
    const { slug, user_id, email } = req.query;

    if (user_id) {
      const dashboard = await Dashboard.query().findOne({
        user_id,
      });

      if (!dashboard) {
        throw new AppError('Dashboard not found', 404);
      }

      return res.json(dashboard);
    }

    if (!slug) {
      throw new AppError('Missing slug', 400);
    }

    const dashboard = await Dashboard.query().findOne({
      slug,
    });

    if (!dashboard) {
      throw new AppError('Dashboard not found', 404);
    }

    if (dashboard.whitelist) {
      const parsedWhitelist = JSON.parse(dashboard.whitelist);

      if (parsedWhitelist.includes(email)) {
        const scholars = await Sync.query().findOne({
          user_id: dashboard.user_id,
        });

        const parsedScholars = scholars?.data.map(scholar => ({
          address: scholar.address,
          name: scholar.name,
          inactive: scholar.inactive,
        }));

        return res.json({
          dashboard: {
            ...dashboard,
            whitelist: !!dashboard.whitelist,
          },
          scholars: parsedScholars,
        });
      }

      if (email) {
        throw new AppError('Unauthorized', 401);
      }
    }

    const scholars = await Sync.query().findOne({
      user_id: dashboard.user_id,
    });

    const parsedScholars = scholars?.data.map(scholar => ({
      address: scholar.address,
      name: scholar.name,
      inactive: scholar.inactive,
    }));

    return res.json({
      dashboard: {
        ...dashboard,
        whitelist: !!dashboard.whitelist,
      },
      ...(!dashboard.whitelist ? { scholars: parsedScholars } : {}),
    });
  }

  async post(req: Request, res: Response): Promise<Response> {
    const { authorization } = req.headers;
    const { whitelist, customLogo } = req.body;

    if (!authorization) {
      throw new AppError('Missing authorization token', 400);
    }

    const auth = await supabase.auth.api.getUser(authorization);

    if (!auth.user) {
      throw new AppError('Invalid user', 401);
    }

    let dashboard = await Dashboard.query().findOne({
      user_id: auth.user.id,
    });

    if (dashboard) {
      dashboard = await dashboard.$query().patchAndFetch({
        logo: customLogo,
        whitelist: whitelist ? JSON.stringify(whitelist) : null,
      });

      return res.json(dashboard);
    }

    dashboard = await Dashboard.query().insert({
      logo: customLogo,
      whitelist: whitelist ? JSON.stringify(whitelist) : null,
      user_id: auth.user.id,
      slug: randomBytes(10).toString('hex'),
      type: 1,
    });

    return res.json(dashboard);
  }
}
