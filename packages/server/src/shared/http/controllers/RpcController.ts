import { Request, Response } from 'express';
import axios from 'axios';

import AppError from '@src/shared/errors/AppError';

export class RpcController {
  async post(req: Request, res: Response): Promise<Response> {
    let endpoint: string;

    const writeMethods = ['eth_sendRawTransaction'];

    if (req.body?.params[0]?.data?.startsWith('0x70a08231')) {
      endpoint = 'https://api.roninchain.com/rpc';
    }

    if (req.body && writeMethods.includes(req.body.method)) {
      endpoint = 'https://proxy.roninchain.com/free-gas-rpc';
    } else {
      endpoint = 'https://api.roninchain.com/rpc';
    }

    return axios
      .post(endpoint, req.body)
      .then(response => res.setHeader('endpoint', endpoint).json(response.data))
      .catch(err => {
        throw new AppError(err.message, err.statusCode ?? 500);
      });
  }
}
