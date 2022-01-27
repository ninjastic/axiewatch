import { Request, Response } from 'express';
import axios from 'axios';

import AppError from '@src/shared/errors/AppError';

export class GraphQLController {
  async post(req: Request, res: Response): Promise<Response> {
    const url = 'https://axieinfinity.com/graphql-server-v2/graphql';

    return axios
      .post(url, req.body)
      .then(response => res.json(response.data))
      .catch(err => {
        throw new AppError(err.message, err.statusCode ?? 500);
      });
  }
}
