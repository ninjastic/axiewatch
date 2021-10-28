import { Job, Worker } from 'bullmq';

import redis from '@src/config/redis';
import { trackScholarJob } from './trackScholar.job';

const worker = new Worker('scholarsQueue', async (job: Job) => trackScholarJob(job.data.address), {
  limiter: {
    max: Number(process.env.TRACK_SCHOLARS_QUEUE_LIMITER),
    duration: Number(process.env.TRACK_SCHOLARS_QUEUE_DURATION_MS),
  },
  connection: redis,
});

export default worker;
