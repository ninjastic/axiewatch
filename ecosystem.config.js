const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'packages', 'server', '.env') });

module.exports = {
  apps: [
    {
      name: 'server',
      script: 'packages/server/dist/server.js',
      exec_mode: 'cluster',
    },
    {
      name: 'queue',
      script: 'packages/server/dist/queue.js',
    },
  ],
};
