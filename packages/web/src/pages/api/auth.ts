import { NextApiRequest, NextApiResponse } from 'next';

import { supabase } from '../../services/supabase';

export const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
