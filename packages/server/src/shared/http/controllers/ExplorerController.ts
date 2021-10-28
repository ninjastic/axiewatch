import { Request, Response } from 'express';
import axios from 'axios';

import AppError from '@src/shared/errors/AppError';

export class ExplorerController {
  async get(req: Request, res: Response): Promise<Response> {
    const baseUrl = 'https://explorer.roninchain.com/api/';
    const path = req.path.replace('/explorer', '');

    return axios
      .get(`${baseUrl}/${path}`)
      .then(response => res.json(response.data))
      .catch(err => {
        throw new AppError(err.message, err.statusCode ?? 500);
      });
  }
}
