module.exports = {
  apps: [
    {
      name: 'server',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      exec_mode: 'cluster',
    },
    {
      name: 'node_modules/next/dist/bin/next',
      script: 'yarn server start:queue',
    },
  ],
};
