import { Queue, QueueScheduler } from 'bullmq';

import { cache } from 'src/services/cache';

import '../../database';

const queue = new Queue('trackScholarQueue', {
  connection: cache,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scheduler = new QueueScheduler('trackScholarQueue', { connection: cache });

export default queue;
