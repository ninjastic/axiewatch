const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'packages', 'server', '.env') });

module.exports = {
  apps: [
    {
      name: 'workers',
      script: 'packages/server/dist/shared/queue/workers.js',
    },
  ],
};
