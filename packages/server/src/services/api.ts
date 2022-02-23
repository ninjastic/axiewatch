import axios from 'axios';
import lodash from 'lodash';

import proxies from '../config/proxies';

interface Proxy {
  ip: string;
  port: number;
  username: string;
  password: string;
}

const getRandomProxy = (): Proxy | null => {
  const proxy = lodash.sample(proxies) as string;
  if (!proxy) return null;

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

  if (!proxy?.ip || !proxy?.port) {
    return request;
  }

  const requestWithProxy = { ...request };

  const auth =
    proxy.username && proxy.password
      ? {
          username: proxy.username,
          password: proxy.password,
        }
      : undefined;

  requestWithProxy.proxy = {
    protocol: 'http',
    host: proxy.ip,
    port: proxy.port,
    auth,
  };

  return requestWithProxy;
});

export { proxiedApi };
