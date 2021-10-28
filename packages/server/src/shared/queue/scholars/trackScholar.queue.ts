import { Queue, QueueScheduler } from 'bullmq';

import '../../database';

import redis from '@src/config/redis';

const queue = new Queue('trackScholarQueue', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scheduler = new QueueScheduler('trackScholarQueue', { connection: redis });

export default queue;
