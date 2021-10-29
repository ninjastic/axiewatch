module.exports = {
  apps: [
    {
      name: 'workers',
      script: 'packages/server/dist/shared/queue/workers.js',
    },
  ],
  deploy: {
    production: {
      key: '/root/.ssh/ninja',
      user: 'ninja',
      host: ['23.94.3.119'], // '45.129.228.184', '45.129.228.183', '88.218.200.87', '88.218.200.85'
      ref: 'origin/chore-deploy-workers',
      repo: 'git@github.com:ninjastic/axiewatch.git',
      path: '/home/ninja/axiewatch',
      'post-deploy': 'yarn install && yarn server build && pm2 startOrRestart workers.ecosystem.config.js',
    },
  },
};
