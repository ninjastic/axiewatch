/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'packages', 'server', '.env') });

module.exports = {
  apps: [
    {
      name: 'workers',
      script: 'packages/server/dist/shared/queue/workers.js',
      instances: process.env.WORKERS_INSTANCES || 1,
      exec_mode: 'cluster',
    },
  ],
  deploy: {
    production: {
      key: '/root/.ssh/ninja',
      user: 'ninja',
      host: ['23.94.3.119'],
      ref: 'origin/master',
      repo: 'git@github.com:ninjastic/axiewatch.git',
      path: '/home/ninja/axiewatch',
      'pre-setup': 'rm -rf /home/ninja/axiewatch/source',
      'post-deploy': 'yarn install && yarn server build && pm2 startOrRestart workers.ecosystem.config.js',
    },
  },
};
