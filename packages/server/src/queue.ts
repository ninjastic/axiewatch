import 'dotenv/config';
import { Job, Queue, QueueScheduler, Worker } from 'bullmq';
import { tracking } from '@prisma/client';
import cron from 'node-cron';

import { getUniqueAddresses, trackScholarJob } from './jobs/trackScholarJob';

async function main() {
  const connection = {
    host: 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  };

  const queue = new Queue('scholarsQueue', {
    connection,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  });

  const scheduler = new QueueScheduler('scholarsQueue', { connection });
  await scheduler.waitUntilReady();

  const worker = new Worker('scholarsQueue', async (job: Job) => trackScholarJob(job.data.address), {
    limiter: { max: 2, duration: 200 },
    connection,
  });

  const addresses = await getUniqueAddresses();

  console.log('jobs to be added', addresses.length);

  await queue.addBulk(
    addresses.map(address => ({
      name: 'trackScholar',
      data: { address },
    }))
  );

  worker.on('active', (job: Job) => {
    console.log('starting', job.data.address);
  });

  worker.on('completed', (job: Job, result: tracking) => {
    console.log('done', result.address, result.slpAmount);
  });

  worker.on('failed', (jobId, err) => {
    console.log(jobId, err);
  });
}

// runs the cron job at 00:01 (UTC) every day
cron.schedule('1 0 * * *', () => main(), { timezone: 'Etc/UTC' });

console.log('> Running');
