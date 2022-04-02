import { Request, Response } from 'express';

import AppError from 'src/shared/errors/AppError';
import { proxiedApi } from 'src/services/api';

export class GraphQLController {
  async post(req: Request, res: Response): Promise<Response> {
    const url = 'https://graphql-gateway.axieinfinity.com/graphql';

    return proxiedApi
      .post(url, req.body)
      .then(response => res.json(response.data))
      .catch(err => {
        throw new AppError(err.message, err.statusCode ?? 500);
      });
  }
}
