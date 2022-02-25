import { Request, Response } from 'express';

import AppError from 'src/shared/errors/AppError';
import { proxiedApi } from 'src/services/api';

export class ExplorerController {
  async get(req: Request, res: Response): Promise<Response> {
    const baseUrl = 'https://explorer.roninchain.com/api';
    const path = req.url.replace('/explorer/', '');

    return proxiedApi
      .get(`${baseUrl}/${path}`)
      .then(response => res.json(response.data))
      .catch(err => {
        throw new AppError(err.message, err.statusCode ?? 500);
      });
  }
}
