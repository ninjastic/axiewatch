import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

import { supabase } from '../../services/supabase';
import { prisma } from '../../services/prisma';

export class DashboardController {
  async get(req: Request, res: Response): Promise<Response> {
    const { slug, user_id, email } = req.query;

    if (user_id) {
      const dashboard = await prisma.dashboard.findUnique({
        where: {
          user_id: String(user_id),
        },
      });

      if (!dashboard) {
        return res.status(404).json({ error: 'Dashboard not found' });
      }

      return res.json(dashboard);
    }

    if (!slug) {
      return res.status(400).json({ error: 'Missing slug' });
    }

    const dashboard = await prisma.dashboard.findUnique({
      where: {
        slug: String(slug),
      },
    });

    if (!dashboard) {
      return res.json(404).json({ error: 'Dashboard not found' });
    }

    if (dashboard.whitelist) {
      const parsedWhitelist = JSON.parse(dashboard.whitelist);

      if (parsedWhitelist.includes(email)) {
        const scholars = await prisma.sync.findUnique({
          where: {
            user_id: dashboard.user_id,
          },
        });

        const parsedScholars = (JSON.parse(scholars?.data || '[]') as any[]).map((scholar: any) => ({
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
        return res.status(404).json({ error: 'Unauthorized' });
      }
    }

    const scholars = await prisma.sync.findUnique({
      where: {
        user_id: dashboard.user_id,
      },
    });

    const parsedScholars = (JSON.parse(scholars?.data || '[]') as any[]).map((scholar: any) => ({
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
      return res.status(400).json({ error: 'Missing authorization token' });
    }

    const auth = await supabase.auth.api.getUser(authorization);

    if (!auth.user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const dashboard = await prisma.dashboard.upsert({
      where: {
        user_id: auth.user.id,
      },
      update: {
        logo: customLogo,
        whitelist: whitelist ? JSON.stringify(whitelist) : null,
      },
      create: {
        logo: customLogo,
        whitelist: whitelist ? JSON.stringify(whitelist) : null,
        user_id: auth.user.id,
        slug: randomBytes(10).toString('hex'),
        type: 1,
      },
    });

    return res.json(dashboard);
  }
}
