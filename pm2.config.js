module.exports = {
  apps: [
    {
      name: 'server',
      script: 'yarn server start:server',
      exec_mode: 'cluster',
    },
    {
      name: 'queue',
      script: 'yarn server start:queue',
      exec_mode: 'cluster',
    },
  ],
};
