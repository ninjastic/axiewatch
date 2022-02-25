import Redis from 'ioredis';

import config from 'src/config/redis';

export const cache = new Redis(config);
