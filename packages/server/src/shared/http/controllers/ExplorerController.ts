import { Request, Response } from 'express';
import axios from 'axios';

export class ExplorerController {
  async get(req: Request, res: Response): Promise<Response> {
    const baseUrl = 'https://explorer.roninchain.com/api/';
    const path = req.path.replace('/explorer', '');

    return axios
      .get(`${baseUrl}/${path}`)
      .then(response => res.json(response.data))
      .catch(err => res.status(err.statusCode ?? 500).json({ error: err.message }));
  }
}
