import 'dotenv/config';

import '../database';

import trackScholarWorker from './scholars/trackScholar.worker';

console.log(`Starting worker ${trackScholarWorker.name}`);

trackScholarWorker.on('failed', (_, err) => {
  console.log(`${trackScholarWorker.name} falied with error ${err.message}`);
});
