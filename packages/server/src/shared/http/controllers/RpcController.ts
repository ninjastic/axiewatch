import { Request, Response } from 'express';
import axios from 'axios';

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
      .post(endpoint, req.body, {
        headers: {
          origin: 'moz-extension://a0904227-ee63-4d3d-aacc-82d592d1b746',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
        },
      })
      .then(response => res.setHeader('endpoint', endpoint).json(response.data))
      .catch(err => res.status(err.statusCode ?? 500).json({ error: err.message }));
  }
}
