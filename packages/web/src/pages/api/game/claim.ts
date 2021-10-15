import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { address } = req.query;
  const { authorization } = req.headers;

  try {
    if (!address) {
      throw new Error('Missing address');
    }

    if (!authorization) {
      throw new Error('Missing authorization');
    }

    const endpoint = `https://game-api.skymavis.com/game-api/clients/${address}/items/1/claim`;

    const headers = {
      authorization,
    };

    const response = await axios.post(endpoint, null, { headers });

    return res.json(response.data);
  } catch (error: any) {
    return res.status(error.response?.status || 500).json({ error: error.message });
  }
};

export default handler;
