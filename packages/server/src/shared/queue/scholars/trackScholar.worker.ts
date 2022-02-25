import { Job, Worker } from 'bullmq';

import { cache } from 'src/services/cache';
import { trackScholarJob } from './trackScholar.job';

const worker = new Worker('trackScholarQueue', async (job: Job) => trackScholarJob(job.data.address), {
  limiter: {
    max: Number(process.env.TRACK_SCHOLARS_QUEUE_LIMITER),
    duration: Number(process.env.TRACK_SCHOLARS_QUEUE_DURATION_MS),
  },
  connection: cache,
  concurrency: Number(process.env.TRACK_SCHOLARS_QUEUE_CONCURRENCY),
});

export default worker;
