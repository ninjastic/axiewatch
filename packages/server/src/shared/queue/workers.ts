import 'dotenv/config';

import '../database';

import trackScholarWorker from './scholars/trackScholar.worker';

console.log(`Starting worker ${trackScholarWorker.name}`);

trackScholarWorker.on('active', job => {
  console.log(`[${trackScholarWorker.name}] new job ${job.data.address}`);
});

trackScholarWorker.on('completed', job => {
  console.log(`[${trackScholarWorker.name}] completed ${job.data.address}`);
});

trackScholarWorker.on('failed', (job, err) => {
  console.log(`[${trackScholarWorker.name}] failed ${job.data.address} with error: ${err.message}`);
});
