/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'packages', 'server', '.env') });

module.exports = {
  apps: [
    {
      name: 'server',
      script: 'packages/server/dist/shared/http/server.js',
      instances: process.env.SERVER_INSTANCES || 1,
      exec_mode: 'cluster',
    },
    {
      name: 'queue',
      script: 'packages/server/dist/shared/queue/index.js',
    },
  ],
};
