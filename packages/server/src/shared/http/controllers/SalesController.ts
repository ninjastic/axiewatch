import { Request, Response } from 'express';
import axios from 'axios';

import AppError from 'src/shared/errors/AppError';

export class SalesController {
  async post(req: Request, res: Response): Promise<Response> {
    return axios
      .post(
        'https://ebc-data-api.herokuapp.com/api/v1/marketplace/successful-auctions',
        { address: req.body.address, limit: req.body.limit, take: req.body.take },
        {
          headers: {
            'X-API-KEY': 'exm5asdtg89232jwmnre09123',
          },
        }
      )
      .then(response => res.json(response.data))
      .catch(err => {
        throw new AppError(err.message, err.statusCode ?? 500);
      });
  }
}
