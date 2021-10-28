import 'dotenv/config';
import cron from 'node-cron';

import '../database';

import { getUniqueAddresses } from './scholars/trackScholar.job';
import trackScholarQueue from './scholars/trackScholar.queue';

const trackScholars = async () => {
  console.log('Starting cron job: trackScholars');

  const addresses = await getUniqueAddresses();

  const jobs = addresses.map(address => ({
    name: 'trackScholar',
    data: { address },
  }));

  console.log(`Adding ${jobs.length} jobs to ${trackScholarQueue.name}`);

  await trackScholarQueue.addBulk(jobs);
};

// runs the cron job at 00:00 (UTC) every day
cron.schedule('0 0 * * *', () => trackScholars(), { timezone: 'Etc/UTC' });

console.log('> Ready to start trackScholarQueue at 00:00 UTC');
