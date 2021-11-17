import axios from 'axios';
import lodash from 'lodash';

import proxies from '../config/proxies';

interface Proxy {
  ip: string;
  port: number;
  username: string;
  password: string;
}

const getRandomProxy = (): Proxy => {
  const proxy = lodash.sample(proxies) as string;
  const [ip, port, username, password] = proxy.split(':');

  return {
    ip,
    port: Number(port),
    username,
    password,
  };
};

const proxiedApi = axios.create();

proxiedApi.interceptors.request.use(request => {
  const proxy = getRandomProxy();
  const requestWithProxy = { ...request };

  requestWithProxy.proxy = {
    protocol: 'http',
    host: proxy.ip,
    port: proxy.port,
    auth: {
      username: proxy.username,
      password: proxy.password,
    },
  };

  return requestWithProxy;
});

export { proxiedApi };
